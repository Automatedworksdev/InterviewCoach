# AI Interview Coach

24/7 AI-powered mock interviews with real-time feedback for job seekers.

## Features

- **Real-time mock interviews** with AI interviewer
- **Detailed feedback** on answers, tone, and confidence
- **Role-specific questions** for tech, consulting, finance, marketing, etc.
- **Practice anywhere** - web app accessible on all devices
- **Demo interviews** - try before you sign up

## Business Model

| Plan | Price | Features |
|------|-------|----------|
| Starter | £29/month | 10 mock interviews per month, basic feedback |
| Pro | £99/month | Unlimited interviews, detailed feedback, video analysis |
| Team | £299/month | 5 seats, admin dashboard, custom questions |

## Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** Node.js, Express.js
- **Database:** SQLite (development), PostgreSQL (production)
- **AI Engine:** OpenAI GPT-4 (for interview simulation)
- **Payments:** Stripe
- **Email:** Nodemailer + Gmail SMTP

## Deployment Options

### Option 1: VPS (Recommended)
```bash
# Copy files to your VPS
scp -r . user@your-vps:/opt/interviewcoach/

# Run deployment script (as root)
ssh user@your-vps "sudo bash /opt/interviewcoach/deploy/deploy-vps.sh"
```

### Option 2: Railway (Easiest)
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

### Option 3: Render
1. Push to GitHub
2. Connect repo at https://render.com
3. Render will auto-deploy from `render.yaml`

### Option 4: Docker
```bash
docker build -t interviewcoach .
docker run -p 3004:3004 -d interviewcoach
```

## Environment Variables

Create `.env` file:
```env
PORT=3004
NODE_ENV=production
DATABASE_URL=./interviewcoach.db
OPENAI_API_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
EMAIL_USER=automateworksdev@gmail.com
EMAIL_PASSWORD=your_app_password_here
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3004
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/waitlist` - Join waitlist
- `GET /api/waitlist/stats` - Waitlist statistics
- `GET /api/waitlist/recent` - Recent signups
- `GET /api/demo-interview/:email` - Demo interview results

## Promotion Strategy

1. **Twitter:** Target job seekers, career coaches, HR professionals
2. **Reddit:** r/careerguidance, r/jobs, r/recruitinghell
3. **LinkedIn:** Content marketing for professionals
4. **Google Ads:** Target "interview practice" keywords
5. **Email Marketing:** Nurture waitlist with tips and updates

## Revenue Projections

- **Month 1:** £1,000-£3,000 MRR
- **Month 3:** £5,000-£10,000 MRR
- **Month 6:** £15,000-£25,000 MRR

## Next Steps After Deployment

1. Configure email automation for waitlist
2. Set up Stripe subscription plans
3. Implement OpenAI integration for real interviews
4. Create social media promotion scripts
5. Build referral program for viral growth

## Contact

For deployment assistance or questions, contact:
- Email: automateworksdev@gmail.com
- WhatsApp: +447482403873