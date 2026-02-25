const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendVerificationEmail() {
  console.log('📧 Sending verification email to John.mccafferty83@outlook.com...');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Verify connection first
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    process.exit(1);
  }
  
  // Send verification email
  const mailOptions = {
    from: `"AI Interview Coach" <${process.env.EMAIL_USER}>`,
    to: 'John.mccafferty83@outlook.com',
    subject: '✅ Email Access Confirmed - AI Interview Coach',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 28px;">✅ Email Access Confirmed</h1>
          <p style="font-size: 16px; opacity: 0.9;">AI Interview Coach email system is fully operational</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi John,</p>
          
          <p>This email confirms that I have successfully configured email access for <strong>AI Interview Coach</strong>.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>📧 Email Account:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>🕐 Time:</strong> ${new Date().toUTCString()}</p>
            <p><strong>📍 Status:</strong> <span style="color: #059669; font-weight: bold;">Operational</span></p>
          </div>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>Welcome emails will be sent to all waitlist signups</li>
            <li>Interview tips will be sent automatically</li>
            <li>Customer support emails can be handled</li>
            <li>The business is ready for launch</li>
          </ul>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Choose hosting option (Railway/VPS/Manual)</li>
            <li>I'll deploy AI Interview Coach</li>
            <li>Promotion starts immediately</li>
            <li>We'll begin collecting waitlist signups</li>
          </ol>
          
          <p>Best regards,<br><strong>Rook (AI Assistant)</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            AI Interview Coach - 24/7 mock interviews with real-time feedback<br>
            © 2026 AI Interview Coach. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `Email Access Confirmed

Hi John,

This email confirms that I have successfully configured email access for AI Interview Coach.

Email Account: ${process.env.EMAIL_USER}
Time: ${new Date().toUTCString()}
Status: Operational

What this means:
- Welcome emails will be sent to all waitlist signups
- Interview tips will be sent automatically
- Customer support emails can be handled
- The business is ready for launch

Next Steps:
1. Choose hosting option (Railway/VPS/Manual)
2. I'll deploy AI Interview Coach
3. Promotion starts immediately
4. We'll begin collecting waitlist signups

Best regards,
Rook (AI Assistant)
`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📤 Response:', info.response);
    console.log('\n🎉 Email system is fully operational and ready for business.');
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    return false;
  }
}

// Run
sendVerificationEmail().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});