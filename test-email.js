#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  console.log('📧 Testing email access for automateworksdev@gmail.com...');
  
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPass) {
    console.error('❌ Email credentials not found in .env file');
    process.exit(1);
  }
  
  console.log('🔐 Using email:', emailUser);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  
  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Possible issues:');
      console.log('1. Incorrect password');
      console.log('2. Need to enable "Less secure app access"');
      console.log('3. Need to use App Password (if 2FA enabled)');
      console.log('4. Account access restrictions');
    }
    
    process.exit(1);
  }
  
  // Send test email
  const mailOptions = {
    from: `"AI Interview Coach" <${emailUser}>`,
    to: 'john@example.com', // Will need actual email
    subject: '✅ AI Interview Coach - Email Access Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 10px;">
          <h1 style="margin: 0; font-size: 28px;">✅ Email Access Confirmed</h1>
          <p style="font-size: 16px; opacity: 0.9;">AI Interview Coach is ready to send emails</p>
        </div>
        
        <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p>Hi John,</p>
          
          <p>This email confirms that I have successfully configured email access for:</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>📧 Email Account:</strong> ${emailUser}</p>
            <p><strong>🕐 Time:</strong> ${new Date().toUTCString()}</p>
            <p><strong>📍 Server:</strong> OpenClaw VPS</p>
          </div>
          
          <p><strong>What this means:</strong></p>
          <ul>
            <li>I can now send welcome emails to waitlist subscribers</li>
            <li>I can send interview tips and updates</li>
            <li>I can handle customer support emails</li>
            <li>Email automation is ready for launch</li>
          </ul>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Deploy AI Interview Coach to hosting</li>
            <li>Start promotion and collect waitlist signups</li>
            <li>Automated emails will begin sending to subscribers</li>
          </ol>
          
          <p>Best regards,<br><strong>Rook (AI Assistant)</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            AI Interview Coach - 24/7 mock interviews with real-time feedback<br>
            © 2026 AI Interview Coach. All rights reserved.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📤 Response:', info.response);
    
    // Also send to John's WhatsApp number email if available
    const johnEmail = '447482403873@sms.whatsapp.net'; // WhatsApp SMS gateway
    console.log('\n📱 Attempting to send to WhatsApp SMS gateway...');
    
    const smsOptions = {
      from: `"AI Interview Coach" <${emailUser}>`,
      to: `${johnEmail}`,
      subject: 'Email access confirmed',
      text: '✅ AI Interview Coach email access confirmed. Check your email for details.'
    };
    
    try {
      const smsInfo = await transporter.sendMail(smsOptions);
      console.log('✅ SMS notification sent to WhatsApp');
    } catch (smsError) {
      console.log('📱 SMS notification failed (expected):', smsError.message);
    }
    
    console.log('\n🎉 Email system is fully operational!');
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return false;
  }
}

// Run test
sendTestEmail().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});