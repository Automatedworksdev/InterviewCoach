# AI Interview Coach - Deployment Guide

Choose ONE option below. All options work - pick the easiest for you.

## Option 1: Railway (Easiest, Free)
**Time:** 5 minutes
**Cost:** Free for basic usage
**Best for:** Quick deployment with minimal technical knowledge

### Steps:
1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Authorize GitHub access
4. Select the `interviewcoach` repository (you may need to create one first)
5. Railway will auto-deploy from the `railway.json` config
6. Get your live URL from Railway dashboard

**Done!** The app is now live at `https://interviewcoach.up.railway.app`

## Option 2: Render (Also Easy, Free)
**Time:** 5 minutes  
**Cost:** Free tier available
**Best for:** Simple deployment with GitHub integration

### Steps:
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select the `interviewcoach` repository
5. Render will auto-configure from `render.yaml`
6. Click "Create Web Service"

**Done!** The app is now live at your Render URL.

## Option 3: VPS (Your Existing Server)
**Time:** 10 minutes
**Cost:** Already paying for VPS
**Best for:** Full control, using existing infrastructure

### Steps:
```bash
# 1. Copy files to your VPS
scp -r /home/john/.openclaw/workspace/interviewcoach john@51.255.200.160:/home/john/

# 2. SSH into your VPS
ssh john@51.255.200.160

# 3. Run deployment script (requires sudo)
cd /home/john/interviewcoach
sudo bash deploy/deploy-vps.sh

# 4. The script will:
#   - Install Node.js if needed
#   - Create systemd service
#   - Configure Nginx (if installed)
#   - Start the application
```

**Done!** The app runs on port 3004, accessible at `http://51.255.200.160:3004`

## Option 4: Docker (Anywhere)
**Time:** 5 minutes if Docker is installed
**Cost:** Free
**Best for:** Developers familiar with Docker

### Steps:
```bash
# 1. Build Docker image
docker build -t interviewcoach .

# 2. Run container
docker run -p 3004:3004 -d interviewcoach

# 3. Access at http://localhost:3004
```

## Option 5: Manual Node.js (Development)
**Time:** 2 minutes
**Cost:** Free
**Best for:** Local testing

### Steps:
```bash
# 1. Install dependencies
npm install

# 2. Start server
npm run dev

# 3. Access at http://localhost:3004
```

## Post-Deployment Steps

### 1. Test Your Deployment
- Visit your URL in browser
- Click "Join Waitlist" to test form submission
- Check `/api/health` endpoint (e.g., `https://your-url.com/api/health`)

### 2. Configure Email (Optional for now)
Add to `.env` file:
```
EMAIL_USER=automateworksdev@gmail.com
EMAIL_PASSWORD=your_app_password_here
```

### 3. Configure Domain (Optional)
- Buy domain: `interviewcoach.ai` or similar
- Point DNS to your deployment
- Setup SSL (Railway/Render auto-handle this)

### 4. Start Promotion
Once live, I'll:
1. Run Twitter promotion scripts
2. Post to Reddit (r/careerguidance, r/jobs)
3. Begin collecting waitlist signups
4. Setup email automation for nurturing

## Quick Start Recommendation

**If you want it live in 5 minutes:**
1. Create GitHub repo named `interviewcoach`
2. Push the code: `git push origin main`
3. Deploy on Railway (Option 1)
4. Share the URL with me

**If you want to use existing VPS:**
1. Run Option 3 (VPS deployment)
2. Share the URL with me

## Need Help?

**I can deploy for you if you provide:**
- GitHub access (for Railway/Render)
- OR VPS SSH access (for VPS deployment)
- OR Railway/Render account access

**Just reply with which option you prefer and the access needed.**