# AI Interview Coach - Simple Deployment

Choose **ONE** option:

## Option A: Railway (Easiest - 5 minutes)
**You need:** GitHub account
**I need:** Access to push code to GitHub

**Steps:**
1. Create GitHub repo named "interviewcoach"
2. Give me access to push code
3. I'll deploy to Railway (free)
4. Done! App is live instantly

## Option B: VPS (Your Server - 10 minutes)
**You need:** SSH access to 51.255.200.160
**I need:** SSH credentials or you run the script

**Steps:**
```bash
# Copy files to VPS
scp -r /home/john/.openclaw/workspace/interviewcoach john@51.255.200.160:/home/john/

# SSH in and run deploy script
ssh john@51.255.200.160
cd /home/john/interviewcoach
sudo bash deploy/deploy-vps.sh
```

## Option C: You Deploy (I Guide)
**You need:** Basic terminal skills
**I need:** You to follow my instructions

**I'll send you step-by-step commands.**

## What's Ready
✅ **Landing page** - Professional design, waitlist form
✅ **Backend API** - Collects emails, provides demo interviews  
✅ **Twitter promotion** - Automated script (needs API keys)
✅ **Email automation** - Welcome emails, tips (needs App Password fix)
✅ **Deployment scripts** - VPS, Railway, Render, Docker

## Timeline After Deployment
**Day 1:** Launch, start promotion, collect waitlist
**Day 3:** 500+ waitlist goal, fix email, start nurturing
**Day 5:** First paying customers (£1k+ MRR goal)
**Day 30:** £5k-£10k MRR target

## Email Fix Needed
**Current:** Password authentication blocked by Google
**Fix:** App Password from Google Security settings
**Time:** 2 minutes to generate

## Reply With:
**"A"** - Railway (easiest)
**"B"** - VPS (your server)
**"C"** - You deploy with my guidance

**Plus:** Let me know when you have App Password for email