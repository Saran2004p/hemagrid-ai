const { transporter } = require('./mailer')
const {
  donorNotificationEmail,
  coordinatorNotificationEmail,
  donorConfirmedEmail,
  donorWelcomeEmail,
} = require('./templates')

const FROM        = `"BloodBridge AI 🩸" <${process.env.EMAIL_USER}>`
const COORDINATOR = process.env.COORDINATOR_EMAIL || 'contact.bloodbridge@gmail.com'

// ── Send welcome email to new donor ─────────────
const sendWelcomeEmail = async ({ donor }) => {
  console.log(`📧 Attempting welcome email to: ${donor.email}`)
  console.log(`📧 EMAIL_CONNECTED: ${global.EMAIL_CONNECTED}`)

  if (!donor.email) {
    console.log('⚠️  No email address for donor — skipping')
    return false
  }
  if (!global.EMAIL_CONNECTED) {
    console.log('⚠️  Email not connected — skipping welcome email')
    return false
  }

  try {
    const { subject, html, text } = donorWelcomeEmail({ donor })
    const info = await transporter.sendMail({
      from: FROM, to: donor.email, subject, html, text
    })
    console.log(`✅ Welcome email SENT to ${donor.email} — MessageId: ${info.messageId}`)
    return true
  } catch (err) {
    console.error(`❌ Welcome email FAILED to ${donor.email}:`, err.message)
    return false
  }
}

// ── Notify all matched donors ────────────────────
const notifyAllDonors = async ({ donors, request, requestId }) => {
  console.log(`📧 notifyAllDonors called — EMAIL_CONNECTED: ${global.EMAIL_CONNECTED}`)
  console.log(`📧 Donors with email: ${donors.length}`)

  if (!global.EMAIL_CONNECTED) {
    console.log('⚠️  Email not connected — skipping donor notifications')
    return { sent: 0, failed: 0 }
  }

  let sent = 0, failed = 0
  for (const donor of donors) {
    if (!donor.email) { console.log(`⚠️  No email for donor ${donor.name}`); failed++; continue }
    try {
      const { subject, html, text } = donorNotificationEmail({
        donor, request, requestId, aiScore: donor.aiScore || 75
      })
      const info = await transporter.sendMail({ from:FROM, to:donor.email, subject, html, text })
      console.log(`✅ Donor notified: ${donor.email} — ${info.messageId}`)
      sent++
    } catch (err) {
      console.error(`❌ Failed to notify ${donor.email}:`, err.message)
      failed++
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`📧 Result: ${sent} sent, ${failed} failed`)
  return { sent, failed }
}

// ── Notify coordinator of new request ───────────
const notifyCoordinator = async ({ request, requestId, matchedDonors }) => {
  console.log(`📧 Notifying coordinator: ${COORDINATOR}`)
  if (!global.EMAIL_CONNECTED) {
    console.log('⚠️  Email not connected — skipping coordinator notification')
    return false
  }
  try {
    const { subject, html, text } = coordinatorNotificationEmail({ request, requestId, matchedDonors })
    const info = await transporter.sendMail({ from:FROM, to:COORDINATOR, subject, html, text })
    console.log(`✅ Coordinator notified — ${info.messageId}`)
    return true
  } catch (err) {
    console.error('❌ Coordinator notification FAILED:', err.message)
    return false
  }
}

// ── Notify coordinator when donor confirms ───────
const notifyDonorConfirmed = async ({ donor, request }) => {
  if (!global.EMAIL_CONNECTED) return false
  try {
    const { subject, html, text } = donorConfirmedEmail({ donor, request })
    const info = await transporter.sendMail({ from:FROM, to:COORDINATOR, subject, html, text })
    console.log(`✅ Confirmation sent to coordinator — ${info.messageId}`)
    return true
  } catch (err) {
    console.error('❌ Confirmation email FAILED:', err.message)
    return false
  }
}

module.exports = {
  sendWelcomeEmail,
  notifyAllDonors,
  notifyCoordinator,
  notifyDonorConfirmed,
}
