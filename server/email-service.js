const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initialize();
  }
  
  initialize() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPass) {
      console.log('📧 Email service: No credentials provided. Email functionality disabled.');
      console.log('   Set EMAIL_USER and EMAIL_PASSWORD in .env to enable emails.');
      return;
    }
    
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      
      this.initialized = true;
      console.log('📧 Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
    }
  }
  
  async sendWelcomeEmail(email, data) {
    if (!this.initialized) {
      console.log('📧 Email service not initialized. Skipping welcome email to:', email);
      return false;
    }
    
    try {
      const mailOptions = {
        from: `"AI Interview Coach" <${process.env.EMAIL_USER}>`,
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
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #6b7280; text-align: center;">
                AI Interview Coach - 24/7 mock interviews with real-time feedback<br>
                © 2026 AI Interview Coach. All rights reserved.
              </p>
            </div>
          </div>
        `
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Welcome email sent to:', email, 'Message ID:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email to', email, ':', error.message);
      return false;
    }
  }
  
  async sendInterviewTip(email, tipNumber) {
    if (!this.initialized) {
      return false;
    }
    
    const tips = [
      {
        subject: 'Interview Tip: The STAR Method 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f0fdf4; padding: 30px; border-radius: 10px 10px 0 0; border: 1px solid #bbf7d0;">
              <h2 style="margin: 0; color: #059669;">Interview Tip: The STAR Method</h2>
              <p style="color: #047857; margin-top: 10px;">Structure your answers for maximum impact</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p>Struggling with behavioral questions? Use the STAR method:</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📌 S - Situation:</strong> Describe the context</p>
                <p><strong>📋 T - Task:</strong> Explain what needed to be done</p>
                <p><strong>🎯 A - Action:</strong> Detail what YOU did</p>
                <p><strong>📊 R - Result:</strong> Share the outcome and what you learned</p>
              </div>
              
              <h3>Example Question:</h3>
              <p><em>"Tell me about a time you faced a challenge at work."</em></p>
              
              <h3>STAR Answer:</h3>
              <ul>
                <li><strong>Situation:</strong> "At my last role, our team was behind on a critical project deadline."</li>
                <li><strong>Task:</strong> "I needed to identify bottlenecks and get us back on track."</li>
                <li><strong>Action:</strong> "I analyzed our workflow, found redundant approval steps, and implemented a streamlined process."</li>
                <li><strong>Result:</strong> "We delivered the project 2 days early, saving 40+ hours of work."</li>
              </ul>
              
              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>💡 Pro Tip:</strong> Quantify your results! "Increased sales by 15%" sounds better than "Improved sales."</p>
              </div>
              
              <p>When we launch, our AI will help you practice STAR method answers with instant feedback!</p>
              
              <p>Stay tuned for more tips next week!</p>
              
              <p>Best,<br>AI Interview Coach Team</p>
            </div>
          </div>
        `
      },
      {
        subject: '3 Common Interview Mistakes (And How to Avoid Them) ❌',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fef3c7; padding: 30px; border-radius: 10px 10px 0 0; border: 1px solid #fde68a;">
              <h2 style="margin: 0; color: #92400e;">3 Common Interview Mistakes</h2>
              <p style="color: #92400e; margin-top: 10px;">And how to avoid them</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p>Most candidates make these 3 mistakes:</p>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #dc2626;">1. Rambling Without Structure</h3>
                <p><strong>Problem:</strong> Answer goes on for 2+ minutes without clear points</p>
                <p><strong>Fix:</strong> Use the PREP method: <strong>P</strong>oint, <strong>R</strong>eason, <strong>E</strong>xample, <strong>P</strong>oint</p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #dc2626;">2. Not Answering the Question</h3>
                <p><strong>Problem:</strong> Giving generic answers instead of addressing the specific question</p>
                <p><strong>Fix:</strong> Pause, rephrase the question, then answer directly</p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #dc2626;">3. Lack of Enthusiasm</h3>
                <p><strong>Problem:</strong> Monotone voice, poor eye contact (even on video calls)</p>
                <p><strong>Fix:</strong> Smile, vary your tone, show genuine interest</p>
              </div>
              
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #059669;"><strong>🚀 Coming Soon:</strong> AI Interview Coach will analyze your tone, pace, and clarity to help you avoid these mistakes.</p>
              </div>
              
              <p><strong>Launch Update:</strong> We're on track for March 2026 launch. Your discount is still secured!</p>
              
              <p>Best,<br>AI Interview Coach Team</p>
            </div>
          </div>
        `
      }
    ];
    
    if (tipNumber >= tips.length) {
      return false;
    }
    
    try {
      const mailOptions = {
        from: `"AI Interview Coach" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: tips[tipNumber].subject,
        html: tips[tipNumber].html
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Interview tip sent to:', email, 'Tip #:', tipNumber + 1);
      return true;
    } catch (error) {
      console.error('❌ Failed to send interview tip to', email, ':', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();