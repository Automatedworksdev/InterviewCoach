#!/usr/bin/env node

/**
 * Twitter Promotion Script for AI Interview Coach
 * Requires Twitter API v2 credentials
 * 
 * Usage: node twitter-promotion.js
 */

const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

// Configuration
const CONFIG = {
  // Twitter API credentials (set in .env)
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
  
  // Promotion settings
  hashtags: ['#InterviewTips', '#JobSearch', '#CareerAdvice', '#AI', '#JobInterview'],
  targetUsers: ['@careerhacker', '@themuse', '@indeed', '@linkedin'],
  tweetIntervalMinutes: 60, // Space between tweets
  maxTweetsPerDay: 8
};

// Tweet templates
const TWEETS = [
  {
    text: "Struggling with job interviews? Practice with AI Interview Coach - 24/7 mock interviews with real-time feedback. No more expensive human coaches! 🎯\n\nJoin waitlist: {{URL}}",
    image: null
  },
  {
    text: "Just had a mock interview with AI Interview Coach. The feedback was spot-on! My confidence is way up for my real interview next week. 🙌\n\nTry it free: {{URL}}",
    image: null
  },
  {
    text: "Interview anxiety is real. I used to freeze up, but after practicing with AI Interview Coach, I aced my last 3 interviews! 🚀\n\nPractice makes perfect: {{URL}}",
    image: null
  },
  {
    text: "Why pay £100/hour for interview coaching when AI can do it 24/7 for £29/month? 🤖\n\nAI Interview Coach gives you instant feedback on your answers, tone, and confidence.\n\nCheck it out: {{URL}}",
    image: null
  },
  {
    text: "The secret to acing interviews? Practice with AI before the real thing. 🎤\n\nAI Interview Coach has role-specific questions for tech, consulting, finance, marketing, and more!\n\nJoin waitlist: {{URL}}",
    image: null
  },
  {
    text: "Just landed my dream job! 🤩\n\nShoutout to @InterviewCoachAI for helping me practice and build confidence. The AI feedback was incredibly accurate!\n\nTry it: {{URL}}",
    image: null
  },
  {
    text: "Most common interview mistakes:\n1️⃣ Not answering the question directly\n2️⃣ Rambling without structure\n3️⃣ Lack of specific examples\n4️⃣ Poor body language\n\nAI Interview Coach helps you fix all of these! 👇\n{{URL}}",
    image: null
  },
  {
    text: "New to the job market? Don't go into your first interview unprepared. 😰\n\nPractice with AI Interview Coach - get feedback instantly, improve faster, land the job sooner! 🚀\n\nFree demo: {{URL}}",
    image: null
  }
];

// Engagement questions (to boost replies)
const ENGAGEMENT_QUESTIONS = [
  "What's your biggest interview fear?",
  "What interview question always stumps you?",
  "What's your best interview tip?",
  "How do you prepare for interviews?",
  "What's the hardest interview you've ever had?"
];

class TwitterPromoter {
  constructor() {
    if (!CONFIG.appKey || !CONFIG.appSecret) {
      console.error('❌ Twitter API credentials not found in .env file');
      console.error('Add: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET');
      process.exit(1);
    }
    
    this.client = new TwitterApi({
      appKey: CONFIG.appKey,
      appSecret: CONFIG.appSecret,
      accessToken: CONFIG.accessToken,
      accessSecret: CONFIG.accessSecret,
    });
    
    this.tweetCount = 0;
    this.lastTweetTime = 0;
    this.url = process.env.APP_URL || 'https://interviewcoach.ai';
  }
  
  // Replace placeholders in tweet text
  formatTweet(template) {
    let tweet = template.text;
    tweet = tweet.replace('{{URL}}', this.url);
    
    // Add hashtags
    const hashtagCount = (tweet.match(/#/g) || []).length;
    const maxHashtags = 3;
    if (hashtagCount < maxHashtags) {
      const availableHashtags = CONFIG.hashtags.filter(h => !tweet.includes(h));
      const hashtagsToAdd = availableHashtags.slice(0, maxHashtags - hashtagCount);
      if (hashtagsToAdd.length > 0) {
        tweet += '\n' + hashtagsToAdd.join(' ');
      }
    }
    
    return tweet;
  }
  
  // Post a tweet
  async tweet(template) {
    try {
      const tweetText = this.formatTweet(template);
      
      console.log('🐦 Tweeting:', tweetText.substring(0, 50) + '...');
      
      const response = await this.client.v2.tweet(tweetText);
      
      console.log('✅ Tweet posted:', response.data.id);
      this.tweetCount++;
      this.lastTweetTime = Date.now();
      
      // Like and retweet our own tweet (for visibility)
      await this.client.v2.like('me', response.data.id);
      await this.client.v2.retweet('me', response.data.id);
      
      return response;
    } catch (error) {
      console.error('❌ Tweet failed:', error.message);
      throw error;
    }
  }
  
  // Reply to engagement questions
  async engageWithUsers() {
    try {
      // Get mentions
      const mentions = await this.client.v2.userTimeline('me', {
        exclude: 'replies',
        max_results: 10
      });
      
      for (const tweet of mentions.data || []) {
        // Check if we should reply
        if (this.shouldReplyToTweet(tweet)) {
          const reply = this.generateReply(tweet);
          await this.client.v2.reply(reply, tweet.id);
          console.log('💬 Replied to tweet:', tweet.id);
          
          // Wait to avoid rate limits
          await this.delay(5000);
        }
      }
    } catch (error) {
      console.error('❌ Engagement failed:', error.message);
    }
  }
  
  shouldReplyToTweet(tweet) {
    // Don't reply to ourselves
    if (tweet.author_id === 'me') return false;
    
    // Look for keywords
    const keywords = ['interview', 'job', 'career', 'hire', 'application', 'resume', 'cv'];
    const text = tweet.text.toLowerCase();
    return keywords.some(keyword => text.includes(keyword));
  }
  
  generateReply(tweet) {
    const replies = [
      "Practice makes perfect! Try AI Interview Coach for realistic mock interviews with instant feedback. 🚀",
      "Interview anxiety is tough. I used AI Interview Coach to build confidence - it really works! 🤖",
      "Pro tip: Record yourself answering common questions. AI Interview Coach gives feedback on your delivery too! 🎯",
      "The STAR method helps structure answers. AI Interview Coach can help you practice it! ✨"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    return randomReply + ' ' + this.url;
  }
  
  // Follow relevant accounts
  async followTargets() {
    for (const user of CONFIG.targetUsers) {
      try {
        await this.client.v2.follow('me', user);
        console.log('✅ Followed:', user);
        await this.delay(3000); // Avoid rate limits
      } catch (error) {
        console.error('❌ Failed to follow', user, ':', error.message);
      }
    }
  }
  
  // Main promotion loop
  async run() {
    console.log('🚀 Starting Twitter promotion for AI Interview Coach');
    console.log('📊 Configuration:', {
      tweetInterval: CONFIG.tweetIntervalMinutes + ' minutes',
      maxTweetsPerDay: CONFIG.maxTweetsPerDay,
      hashtags: CONFIG.hashtags.length
    });
    
    // Initial follow
    await this.followTargets();
    
    // Main loop
    while (true) {
      try {
        // Check rate limits
        if (this.tweetCount >= CONFIG.maxTweetsPerDay) {
          console.log('🌙 Daily tweet limit reached. Sleeping until tomorrow...');
          await this.delay(12 * 60 * 60 * 1000); // 12 hours
          this.tweetCount = 0;
          continue;
        }
        
        // Wait between tweets
        const timeSinceLastTweet = Date.now() - this.lastTweetTime;
        const minInterval = CONFIG.tweetIntervalMinutes * 60 * 1000;
        
        if (timeSinceLastTweet < minInterval) {
          const waitTime = minInterval - timeSinceLastTweet;
          console.log(`⏳ Waiting ${Math.round(waitTime / 60000)} minutes until next tweet...`);
          await this.delay(waitTime);
        }
        
        // Select random tweet
        const tweetTemplate = TWEETS[Math.floor(Math.random() * TWEETS.length)];
        
        // Post tweet
        await this.tweet(tweetTemplate);
        
        // Engage with users
        await this.engageWithUsers();
        
        // Small delay before next iteration
        await this.delay(60000); // 1 minute
        
      } catch (error) {
        console.error('❌ Error in main loop:', error.message);
        console.log('🔄 Restarting in 5 minutes...');
        await this.delay(5 * 60 * 1000);
      }
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run if called directly
if (require.main === module) {
  const promoter = new TwitterPromoter();
  promoter.run().catch(console.error);
}

module.exports = TwitterPromoter;