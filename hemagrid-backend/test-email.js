// Quick email test script
require('dotenv').config()
const nodemailer = require('nodemailer')

console.log('Testing email with:')
console.log('USER:', process.env.EMAIL_USER)
console.log('PASS exists:', !!process.env.EMAIL_PASS)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function test() {
  try {
    // Verify connection
    await transporter.verify()
    console.log('✅ Connection verified!')

    // Send test email
    const info = await transporter.sendMail({
      from: `"BloodBridge AI 🩸" <${process.env.EMAIL_USER}>`,
      to:   process.env.EMAIL_USER, // send to yourself as test
      subject: '🩸 BloodBridge AI — Email Test',
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#fff5f5;border-radius:12px;">
          <h2 style="color:#c0392b;">✅ Email is Working!</h2>
          <p>BloodBridge AI email notifications are configured correctly.</p>
          <p>Donors will receive alerts when blood is needed!</p>
        </div>
      `,
      text: 'BloodBridge AI email is working correctly!'
    })

    console.log('✅ Test email SENT successfully!')
    console.log('   MessageId:', info.messageId)
    console.log('   Check bloodbridge.ai@gmail.com inbox!')

  } catch (err) {
    console.error('❌ Email test FAILED:', err.message)
    if (err.message.includes('Invalid login')) {
      console.log('   → Check EMAIL_USER and EMAIL_PASS in .env')
      console.log('   → Make sure App Password has no spaces')
    }
    if (err.message.includes('Username and Password not accepted')) {
      console.log('   → Gmail App Password is wrong')
      console.log('   → Generate a new one at: myaccount.google.com/apppasswords')
    }
  }
}

test()
