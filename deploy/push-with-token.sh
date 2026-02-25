#!/bin/bash

# Push to GitHub using token authentication
# Usage: ./deploy/push-with-token.sh <token>
# or: GITHUB_TOKEN=your_token ./deploy/push-with-token.sh

set -e

# Get token from argument or environment variable
if [ $# -eq 1 ]; then
  GITHUB_TOKEN="$1"
elif [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Please provide GitHub token:"
  echo "   Usage: $0 <token>"
  echo "   Or: export GITHUB_TOKEN=your_token"
  exit 1
fi

echo "🚀 Setting up GitHub repository with token..."

# Go to project root
cd "$(dirname "$0")/.."

# Clean up any existing git configuration
if [ -d ".git" ]; then
  echo "📁 Removing existing .git directory..."
  rm -rf .git
fi

# Also check parent directory
if [ -d "/home/john/.openclaw/workspace/.git" ]; then
  echo "⚠️  Removing parent .git directory..."
  rm -rf "/home/john/.openclaw/workspace/.git"
fi

# Initialize git
echo "📁 Initializing git repository..."
git init
git config user.email "automateworksdev@gmail.com"
git config user.name "AI Interview Coach"

# Add files
echo "📦 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "AI Interview Coach - Complete application with email automation, deployment configs, and promotion scripts" || echo "Nothing new to commit"

# Set remote with token authentication
REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/automateworksdev/interviewcoach.git"
echo "📡 Setting remote origin with token authentication..."
git remote add origin "$REMOTE_URL"

# Push
echo "📤 Pushing to GitHub..."
git push -u origin master

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🎉 Deployment ready!"
echo ""
echo "Next steps:"
echo "1. Go to Railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose the interviewcoach repository"
echo "5. Railway will auto-deploy"
echo ""
echo "Your app will be live at: https://interviewcoach.up.railway.app"
echo ""
echo "After deployment, I'll start promotion immediately."