#!/bin/bash

# Push AI Interview Coach to GitHub repository

set -e

echo "🚀 Preparing to push to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "📁 Initializing git repository..."
  git init
  git config user.email "automateworksdev@gmail.com"
  git config user.name "AI Interview Coach"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "AI Interview Coach - Complete application with email automation, deployment configs, and promotion scripts" || echo "Nothing to commit"

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
  echo "📡 Remote origin already exists"
else
  echo "❌ No remote origin configured"
  echo "Please run: git remote add origin https://github.com/automateworksdev/interviewcoach.git"
  echo "Or set your repository URL"
  exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin master

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to Railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose the interviewcoach repository"
echo "5. Railway will auto-deploy"
echo ""
echo "Your app will be live at: https://interviewcoach.up.railway.app"