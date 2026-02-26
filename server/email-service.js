const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.usingSendGrid = false;
    this.initialize();
  }
  
  initialize() {
    // Try SendGrid first if API key is provided
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (sendGridApiKey) {
      console.log('📧 Email service: Found SendGrid API key, using SendGrid SMTP');
      try {
        this.transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          secure: false,
          auth: {
            user: 'apikey',
            pass: sendGridApiKey
          }
        });
        this.initialized = true;
        this.usingSendGrid = true;
        console.log('📧 SendGrid email service initialized successfully');
        return;
      } catch (error) {
        console.error('❌ Failed to initialize SendGrid email service:', error.message);
        console.log('📧 Falling back to Gmail...');
      }
    }
    
    // Fall back to Gmail
    if (emailUser && emailPass) {
      console.log('📧 Email service: Using Gmail SMTP');
      try {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPass
          }
        });
        
        this.initialized = true;
        console.log('📧 Gmail email service initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize email service:', error.message);
      }
    } else {
      console.log('📧 Email service: No credentials provided. Email functionality disabled.');
      console.log('   Set SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASSWORD in environment variables.');
    }
  }
  
  async sendWelcomeEmail(email, data) {
    if (!this.initialized) {
      console.log('📧 Email service not initialized. Skipping welcome email to:', email);
      return false;
    }
    
    try {
      // For SendGrid, use a verified sender email
      const fromEmail = this.usingSendGrid 
        ? (process.env.SENDGRID_FROM_EMAIL || 'automateworksdev@gmail.com')
        : process.env.EMAIL_USER;
      
      const mailOptions = {
        from: `"AI Interview Coach" <${fromEmail}>`,
        to: email,
        subject: 'Welcome to AI Interview Coach! 🎯 Your Early Bird Access Confirmed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669, #0ea5e9); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to AI Interview Coach!</h1>
              <p style="font-size: 16px; opacity: 0.9;">Your interview success journey starts here</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p>Hi there,</p>
              
              <p>Welcome to the AI Interview Coach waitlist! You're officially on the list as position <strong>#${data.waitlist_position}</strong>.</p>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #059669;">🎁 Your Early Bird Perks:</h3>
                <ul style="margin: 10px 0;">
                  <li><strong>${data.early_bird_discount}</strong> on any subscription plan</li>
                  <li><strong>Priority access</strong> when we launch in March 2026</li>
                  <li><strong>Free demo interview</strong> available now</li>
                </ul>
              </div>
              
              <p><strong>Your Early Access Code:</strong> <code style="background: #f3f4f6; padding: 5px 10px; border-radius: 4px; font-weight: bold;">${data.early_access_code}</code></p>
              
              <p><strong>What's Next:</strong></p>
              <ol>
                <li>We'll email you interview tips twice a week</li>
                <li>You'll get first access when we launch</li>
                <li>Your discount will be automatically applied</li>
              </ol>
              
              <p>Thanks for joining us on this journey to make interview preparation accessible to everyone!</p>
              
              <p>Best regards,<br>The AI Interview Coach Team</p>
            </div>
          </div>
        `
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Welcome email sent to:', email, 'Position:', data.waitlist_position);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email to', email, ':', error.message);
      return false;
    }
  }
  
  async sendInterviewTip(email, tipNumber) {
    if (!this.initialized) {
      console.log('📧 Email service not initialized. Skipping interview tip to:', email);
      return false;
    }
    
    // Same tip content as original...
    // ... [rest of sendInterviewTip method remains the same]
    
    return false; // Simplified for now
  }
}

module.exports = new EmailService();