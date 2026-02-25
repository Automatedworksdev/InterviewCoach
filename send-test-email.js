const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTest() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  console.log('Sending test email from/to:', process.env.EMAIL_USER);
  
  const info = await transporter.sendMail({
    from: `"AI Interview Coach Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Send to itself
    subject: '✅ Email Access Test - AI Interview Coach',
    text: `Test email sent at ${new Date().toISOString()}\n\nEmail system is working correctly for AI Interview Coach.`,
    html: `<p>Test email sent at ${new Date().toISOString()}</p><p>Email system is working correctly for AI Interview Coach.</p>`
  });
  
  console.log('Email sent:', info.messageId);
  return info;
}

sendTest().catch(console.error);