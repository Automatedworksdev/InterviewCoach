#!/usr/bin/env node

const { chromium } = require('playwright');

// Human-like delay function
const humanDelay = async (min = 2000, max = 8000) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`Waiting ${delay}ms (human-like delay)`);
  await new Promise(resolve => setTimeout(resolve, delay));
};

// Simulate human typing with variable speed
const humanType = async (page, selector, text, options = {}) => {
  const { skipClick = false } = options;
  console.log(`Typing: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
  if (!skipClick) {
    await page.click(selector);
    await humanDelay(100, 300); // Short pause before typing
  }
  
  for (let i = 0; i < text.length; i++) {
    await page.keyboard.type(text[i]);
    // Variable typing speed (50-150ms between keystrokes)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
  }
};

(async () => {
  console.log('Starting Reddit automation with human-like behavior...');
  
  // Launch browser with human-like settings
  const browser = await chromium.launch({ 
    headless: false, // Visible for debugging, change to true for production
    slowMo: 100, // Slow down actions by 100ms
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to Reddit login
    console.log('Navigating to Reddit login...');
    await page.goto('https://www.reddit.com/login');
    await humanDelay(3000, 5000);
    
    // Check if already logged in
    const loggedIn = await page.locator('[data-testid="user-avatar"]').count();
    
    if (loggedIn === 0) {
      console.log('Not logged in. Attempting automatic login...');
      
      // Check for Google login option
      const googleButton = page.locator('button:has-text("Continue with Google"), button:has-text("Sign in with Google")');
      const hasGoogleButton = await googleButton.count();
      
      if (hasGoogleButton > 0) {
        console.log('Found Google login button. Clicking...');
        await googleButton.click();
        await humanDelay(3000, 5000);
        
        // Google OAuth flow - need to handle email/password entry
        // This is complex due to anti-bot measures
        console.log('Google OAuth detected. This may require manual intervention.');
        console.log('Waiting 30 seconds for manual login if needed...');
        await humanDelay(30000, 30000);
      } else {
        // Standard Reddit login form
        console.log('Using standard Reddit login form...');
        
        // Fill email/username
        const emailField = page.locator('input[name="username"], input[type="email"], input[placeholder*="email"], input[placeholder*="username"]').first();
        if (await emailField.count() > 0) {
          await humanType(page, 'input[name="username"], input[type="email"], input[placeholder*="email"], input[placeholder*="username"]', 'openclawbot69@gmail.com');
        } else {
          console.log('Could not find email field. Trying alternative selectors...');
          // Try any input field
          const anyInput = page.locator('input').first();
          if (await anyInput.count() > 0) {
            await anyInput.click();
            await humanDelay(100, 300);
            await page.keyboard.type('openclawbot69@gmail.com');
          }
        }
        
        await humanDelay(1000, 2000);
        
        // Fill password
        const passwordField = page.locator('input[name="password"], input[type="password"]').first();
        if (await passwordField.count() > 0) {
          await humanType(page, 'input[name="password"], input[type="password"]', 'Celtic1888!');
        }
        
        await humanDelay(1000, 2000);
        
        // Click login button
        const loginButton = page.locator('button[type="submit"], button:has-text("Log In"), button:has-text("Sign In")').first();
        if (await loginButton.count() > 0 && await loginButton.isEnabled()) {
          console.log('Clicking login button...');
          await loginButton.click();
          await humanDelay(5000, 8000);
        }
      }
      
      // Check if login succeeded
      const loginSuccess = await page.locator('[data-testid="user-avatar"]').count();
      if (loginSuccess === 0) {
        console.log('Login may have failed. Checking for error messages...');
        const errorMsg = page.locator('div:has-text("incorrect"), div:has-text("error"), div:has-text("wrong")');
        if (await errorMsg.count() > 0) {
          console.error('Login error detected. May need manual login.');
          // Take screenshot for debugging
          await page.screenshot({ path: '/home/john/.openclaw/workspace/reddit-login-error.png', fullPage: true });
          console.log('Screenshot saved to reddit-login-error.png');
          
          // Wait for manual intervention
          console.log('Waiting 60 seconds for manual login...');
          await humanDelay(60000, 60000);
        }
      } else {
        console.log('✅ Login successful!');
      }
    } else {
      console.log('Already logged in.');
    }
    
    // Navigate to r/webdev submit page
    console.log('Navigating to r/webdev...');
    await page.goto('https://www.reddit.com/r/webdev/submit');
    await humanDelay(4000, 6000);
    
    // Check for submission page
    const isSubmitPage = await page.locator('h1:has-text("Create a post")').count();
    
    if (isSubmitPage === 0) {
      console.log('Not on submission page. Trying alternative navigation...');
      // Try to find submit button
      await page.goto('https://www.reddit.com/r/webdev');
      await humanDelay(2000, 4000);
      
      const submitButton = page.locator('button:has-text("Create Post"), a[href*="/submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await humanDelay(3000, 5000);
      }
    }
    
    // Fill in post title
    console.log('Filling post title...');
    const title = 'DevFlow CLI - All-in-One Developer Productivity Tool (Open Source)';
    await humanType(page, 'textarea[placeholder*="Title"], input[placeholder*="Title"], [data-testid="post-title"]', title);
    await humanDelay(1000, 2000);
    
    // Fill in post body
    console.log('Filling post body...');
    const body = `Hey r/webdev!

I've been frustrated with juggling multiple tools for development workflows - project setup, dependency management, deployment scripts. So I built DevFlow CLI to handle it all with one command.

What it does:
• Project scaffolding (Next.js, React, Vue, Express, Python APIs - 10+ templates)
• Smart dependency management (updates, audits, conflict detection)
• One-command deployment (Vercel, Railway, Docker, Netlify)
• Development workflow automation (git pull → install deps → run migrations → start servers)

Example:
\`\`\`bash
# Create a full-stack Next.js app
devflow create next-app myproject --typescript --tailwind --prisma --auth

# Start development workflow  
devflow start
# Automatically: git pull → install deps → run migrations → start servers

# Deploy to production
devflow deploy vercel --env production
\`\`\`

The core is completely free and open source. Pro features (AI suggestions, team collaboration) are paid.

GitHub: https://github.com/automateworksdev/devflow-cli
Landing page: https://automateworksdev.github.io/devflow-cli/

Would love your feedback! Star if you find it useful, and join the waitlist if you want early access.`;
    
    // Find textarea for post body
    const textareaSelectors = [
      'div[contenteditable="true"]',
      'textarea',
      '[data-testid="post-content"]',
      '.public-DraftEditor-content'
    ];
    
    let bodyFilled = false;
    for (const selector of textareaSelectors) {
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        console.log(`Found textarea with selector: ${selector}`);
        await page.click(selector);
        await humanDelay(500, 1000);
        
        // Type the body
        for (let i = 0; i < body.length; i++) {
          await page.keyboard.type(body[i]);
          // Variable typing speed with occasional longer pauses
          if (i % 50 === 0 && i > 0) {
            await humanDelay(800, 1500); // Longer pause every 50 chars
          } else {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 80 + 40));
          }
        }
        bodyFilled = true;
        break;
      }
    }
    
    if (!bodyFilled) {
      console.log('Could not find textarea. Using keyboard input...');
      // Try to focus on any editable area
      await page.keyboard.press('Tab');
      await humanDelay(100, 300);
      await page.keyboard.type(body);
    }
    
    await humanDelay(2000, 4000);
    
    // Look for submit button
    console.log('Looking for submit button...');
    const submitSelectors = [
      'button:has-text("Post"), button:has-text("Submit"), button:has-text("Create Post")',
      '[data-testid="submit-post"]',
      'button[type="submit"]'
    ];
    
    let submitted = false;
    for (const selector of submitSelectors) {
      const submitButton = page.locator(selector).first();
      if (await submitButton.count() > 0 && await submitButton.isEnabled()) {
        console.log(`Found submit button: ${selector}`);
        await humanDelay(1000, 2000);
        await submitButton.click();
        submitted = true;
        break;
      }
    }
    
    if (submitted) {
      console.log('Post submitted! Waiting for confirmation...');
      await humanDelay(5000, 8000);
      
      // Check for success message
      const successIndicators = [
        'text="Your post has been submitted"',
        'text="Post submitted"',
        '[data-testid="post-composer-submission-success"]'
      ];
      
      let success = false;
      for (const indicator of successIndicators) {
        if (await page.locator(indicator).count() > 0) {
          success = true;
          break;
        }
      }
      
      if (success) {
        console.log('✅ Post successfully submitted to r/webdev!');
        
        // Take success screenshot
        await page.screenshot({ path: '/home/john/.openclaw/workspace/reddit-success.png', fullPage: true });
        console.log('Success screenshot saved to reddit-success.png');
      } else {
        console.log('⚠️ Post may have been submitted, but no confirmation detected.');
        
        // Take post-submission screenshot
        await page.screenshot({ path: '/home/john/.openclaw/workspace/reddit-post-submission.png', fullPage: true });
        console.log('Post-submission screenshot saved to reddit-post-submission.png');
      }
    } else {
      console.log('Could not find submit button. Manual submission required.');
      
      // Take screenshot to show current state
      await page.screenshot({ path: '/home/john/.openclaw/workspace/reddit-no-submit-button.png', fullPage: true });
      console.log('Screenshot saved to reddit-no-submit-button.png');
    }
    
  } catch (error) {
    console.error('Error during Reddit automation:', error);
    await page.screenshot({ path: '/home/john/.openclaw/workspace/reddit-error.png', fullPage: true });
    console.log('Error screenshot saved to reddit-error.png');
  } finally {
    // Keep browser open for inspection (30 seconds)
    console.log('Automation complete. Browser will remain open for 30 seconds for inspection.');
    await humanDelay(30000, 30000);
    await browser.close();
    console.log('Browser closed.');
  }
})();