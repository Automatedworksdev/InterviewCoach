const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Email service
const emailService = require('./email-service');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database setup
const db = new sqlite3.Database('./interviewcoach.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Waitlist table for validation phase
  db.run(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      job_role TEXT,
      experience_level TEXT,
      interview_type TEXT,
      referral_code TEXT,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      confirmed INTEGER DEFAULT 0,
      early_access_granted INTEGER DEFAULT 0
    )
  `);
  
  // Analytics table for tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT,
      event_data TEXT,
      user_agent TEXT,
      ip_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Mock interview results (for demo)
  db.run(`
    CREATE TABLE IF NOT EXISTS mock_interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      job_role TEXT,
      questions_asked TEXT,
      answers_given TEXT,
      feedback TEXT,
      score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database tables initialized');
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AIInterviewCoach',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Waitlist signup
app.post('/api/waitlist', (req, res) => {
  const { email, name, job_role, experience_level, interview_type, referral_code } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO waitlist 
    (email, name, job_role, experience_level, interview_type, referral_code) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(email, name, job_role, experience_level, interview_type, referral_code, function(err) {
    if (err) {
      console.error('Error adding to waitlist:', err);
      return res.status(500).json({ error: 'Failed to join waitlist' });
    }
    
    // Get current waitlist count
    db.get('SELECT COUNT(*) as count FROM waitlist', (err, row) => {
      const count = row ? row.count : 0;
      
      // Track analytics
      db.run(
        'INSERT INTO analytics (event_type, event_data) VALUES (?, ?)',
        ['waitlist_signup', JSON.stringify({ email, job_role, experience_level })]
      );
      
      console.log(`New waitlist signup: ${email}. Total: ${count}`);
      
      // Calculate early access code based on position
      const earlyAccessCode = `AIC-${count.toString().padStart(4, '0')}`;
      const isEarlyBird = count <= 100;
      
      // Create a demo mock interview for this user
      createDemoMockInterview(email, job_role);
      
      // Prepare response data
      const responseData = { 
        success: true, 
        message: 'Successfully joined the AI Interview Coach waitlist!',
        data: {
          waitlist_position: count,
          early_access_code: earlyAccessCode,
          is_early_bird: isEarlyBird,
          early_bird_discount: isEarlyBird ? '60% lifetime discount' : '30% lifetime discount',
          estimated_launch: 'March 2026',
          demo_interview_created: true
        }
      };
      
      // Send response to user immediately
      res.json(responseData);
      
      // Send welcome email asynchronously (don't block response)
      emailService.sendWelcomeEmail(email, responseData.data).then(sent => {
        if (sent) {
          console.log(`📧 Welcome email queued for: ${email}`);
        }
      }).catch(err => {
        console.error(`❌ Failed to send email to ${email}:`, err.message);
      });
    });
  });
  stmt.finalize();
});

// Create a demo mock interview
function createDemoMockInterview(email, job_role) {
  const demoQuestions = [
    "Tell me about yourself and your experience.",
    "Why do you want to work at this company?",
    "What's your greatest professional achievement?",
    "Describe a time you faced a challenge at work and how you overcame it.",
    "Where do you see yourself in 5 years?"
  ];
  
  const demoFeedback = `\n**Strengths:** Good communication skills, clear examples\n\n**Areas to Improve:**\n- Practice more specific examples with metrics\n- Connect answers more directly to the job requirements\n- Add more enthusiasm to your delivery\n\n**Overall Score:** 78/100\n\n**Next Steps:** Practice behavioral questions with the STAR method.`;
  
  db.run(
    'INSERT INTO mock_interviews (email, job_role, questions_asked, answers_given, feedback, score) VALUES (?, ?, ?, ?, ?, ?)',
    [email, job_role || 'Software Engineer', JSON.stringify(demoQuestions), '{}', demoFeedback, 78]
  );
}

// Get waitlist stats (public)
app.get('/api/waitlist/stats', (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total,
      COUNT(DISTINCT job_role) as job_roles,
      COUNT(DISTINCT experience_level) as experience_levels,
      SUM(CASE WHEN experience_level = 'entry-level' THEN 1 ELSE 0 END) as entry_level,
      SUM(CASE WHEN experience_level = 'mid-level' THEN 1 ELSE 0 END) as mid_level,
      SUM(CASE WHEN experience_level = 'senior' THEN 1 ELSE 0 END) as senior_level
    FROM waitlist
  `, (err, row) => {
    if (err) {
      console.error('Error getting waitlist stats:', err);
      return res.status(500).json({ error: 'Failed to get stats' });
    }
    
    // Add some realistic growth for demo
    const baseTotal = row.total || 0;
    const mockTotal = Math.max(baseTotal, 289); // Start with 289
    
    const stats = {
      total: mockTotal,
      job_roles: row.job_roles || 8,
      experience_levels: row.experience_levels || 3,
      entry_level: row.entry_level || Math.floor(mockTotal * 0.4),
      mid_level: row.mid_level || Math.floor(mockTotal * 0.35),
      senior_level: row.senior_level || Math.floor(mockTotal * 0.25),
      updated_at: new Date().toISOString(),
      early_bird_spots_remaining: Math.max(0, 100 - Math.floor(mockTotal * 0.5)),
      mock_interviews_completed: Math.floor(mockTotal * 1.2) // People try multiple mocks
    };
    
    res.json(stats);
  });
});

// Get recent signups (for social proof)
app.get('/api/waitlist/recent', (req, res) => {
  db.all(`
    SELECT job_role, experience_level, interview_type, joined_at
    FROM waitlist 
    ORDER BY joined_at DESC 
    LIMIT 10
  `, (err, rows) => {
    if (err) {
      console.error('Error getting recent signups:', err);
      return res.status(500).json({ error: 'Failed to get recent signups' });
    }
    
    // Format for display
    const formatted = rows.map(row => ({
      job_role: row.job_role || 'Software Engineer',
      experience_level: row.experience_level || 'Mid-level',
      interview_type: row.interview_type || 'Technical',
      joined_ago: timeAgo(new Date(row.joined_at))
    }));
    
    res.json(formatted);
  });
});

// Get demo mock interview results
app.get('/api/demo-interview/:email', (req, res) => {
  const email = req.params.email;
  
  db.get(
    'SELECT * FROM mock_interviews WHERE email = ? ORDER BY created_at DESC LIMIT 1',
    [email],
    (err, row) => {
      if (err) {
        console.error('Error getting demo interview:', err);
        return res.status(500).json({ error: 'Failed to get demo interview' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'No demo interview found' });
      }
      
      res.json({
        success: true,
        data: {
          job_role: row.job_role,
          questions_asked: JSON.parse(row.questions_asked),
          feedback: row.feedback,
          score: row.score,
          created_at: row.created_at
        }
      });
    }
  );
});

// Helper function for time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
}

// Serve landing page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Interview Coach server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Waitlist API: http://localhost:${PORT}/api/waitlist`);
  console.log(`Landing page: http://localhost:${PORT}`);
});