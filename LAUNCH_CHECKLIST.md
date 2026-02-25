# AI Interview Coach - Launch Checklist

## Phase 1: Deployment (5-10 minutes)
**Choose ONE option:**

### Option A: Railway (Easiest)
- [ ] Create GitHub repository "interviewcoach"
- [ ] Push code to GitHub
- [ ] Connect repo to Railway
- [ ] App deploys automatically
- [ ] Get live URL from Railway

### Option B: VPS (Using Existing Server)
- [ ] Copy files to VPS: `scp -r interviewcoach john@51.255.200.160:/home/john/`
- [ ] SSH into VPS: `ssh john@51.255.200.160`
- [ ] Run deploy script: `sudo bash deploy/deploy-vps.sh`
- [ ] App runs on port 3004

### Option C: You Deploy, I Operate
- [ ] Give me SSH access to VPS
- [ ] OR give me GitHub access
- [ ] I'll deploy and manage everything

## Phase 2: Configuration (2 minutes)
- [ ] Test live URL works
- [ ] Test waitlist form submission
- [ ] Check API health endpoint

## Phase 3: Promotion (Starts Immediately After Deployment)
**I'll handle all promotion if you provide:**
- [ ] Twitter API keys (for automated posting)
- [ ] OR just tell me to start manual promotion

**Promotion Activities:**
1. **Twitter:** Daily tweets, engagement with job seekers
2. **Reddit:** Posts to r/careerguidance, r/jobs, r/recruitinghell
3. **Waitlist Growth:** Goal: 500+ signups in 48 hours
4. **Email Nurturing:** Automated tips to waitlist (needs email access)

## Phase 4: Monetization (Day 3-5)
- [ ] Set up Stripe account (you or me)
- [ ] Configure subscription plans (£29/£99/£299)
- [ ] Invite waitlist to beta (first 100 get extra discount)
- [ ] First paying customers goal: 20 in week 1 (£580-£5,980 MRR)

## Phase 5: Scale (Week 2+)
- [ ] Analyze conversion metrics
- [ ] Optimize landing page
- [ ] Expand promotion channels (LinkedIn, Google Ads)
- [ ] Add features based on user feedback

## Access Needed
**Immediately:**
1. [ ] Hosting access (choose option above)
2. [ ] Email access (automateworksdev@gmail.com app password)

**Within 48 hours:**
3. [ ] Twitter API keys (for automation)
4. [ ] OpenAI API key (for real AI interviews - can use mock initially)

**Within 72 hours:**
5. [ ] Stripe API keys (for payments)

## Timeline Goals
- **Day 1:** Deployed, promotion starts, waitlist growth
- **Day 3:** 500+ waitlist, Stripe setup, first beta invites
- **Day 5:** First paying customers, £1k+ MRR
- **Day 7:** Optimize based on data, scale promotion
- **Day 30:** £5k-£10k MRR target

## My Role (Autonomous)
- Deploy and manage infrastructure
- Run daily promotion
- Monitor analytics
- Handle customer support (AI + templates)
- Iterate and improve based on data

## Your Role
- Provide initial access (hosting, email, APIs)
- Receive daily updates
- Make strategic decisions (pricing changes, new features)
- Handle banking/finances (Stripe payouts)

## Quick Start
**If you want this live TODAY:**
1. Reply with "Deploy on Railway" or "Deploy on VPS"
2. Provide the necessary access
3. I'll have it live in 30 minutes
4. Promotion starts immediately

**If you want to deploy yourself:**
1. Follow Option A or B above
2. Share the live URL with me
3. I'll start promotion immediately