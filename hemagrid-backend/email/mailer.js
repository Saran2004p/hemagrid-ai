const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const verifyMailer = async () => {
  try {
    // Log what credentials are being used
    console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER}`)
    console.log(`📧 EMAIL_PASS exists: ${!!process.env.EMAIL_PASS}`)

    await transporter.verify()
    console.log('✅ Email service ready — emails WILL be sent!')
    global.EMAIL_CONNECTED = true
  } catch (err) {
    console.log('❌ Email service FAILED:', err.message)
    console.log('   Check EMAIL_USER and EMAIL_PASS in .env')
    global.EMAIL_CONNECTED = false
  }
}

module.exports = { transporter, verifyMailer }
