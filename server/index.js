const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// PostgreSQL support
let pgClient = null;
let usingPostgreSQL = false;

// Email service
const emailService = require('./email-service');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Database setup
let db = null;

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  // Check if we have a PostgreSQL connection string
  if (databaseUrl && databaseUrl.startsWith('postgres://')) {
    console.log('📊 Using PostgreSQL database');
    usingPostgreSQL = true;
    
    try {
      const { Client } = require('pg');
      pgClient = new Client({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
      });
      
      await pgClient.connect();
      console.log('✅ Connected to PostgreSQL database');
      
      // Create tables if they don't exist
      await createPostgreSQLTables();
      db = pgClient; // Use pgClient for queries
    } catch (error) {
      console.error('❌ Failed to connect to PostgreSQL:', error.message);
      console.log('🔄 Falling back to SQLite');
      usingPostgreSQL = false;
      setupSQLite();
    }
  } else {
    console.log('📊 Using SQLite database (fallback)');
    setupSQLite();
  }
}

function setupSQLite() {
  db = new sqlite3.Database('./interviewcoach.db', (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database');
      createSQLiteTables();
    }
  });
}

async function createPostgreSQLTables() {
  const queries = [
    // Waitlist table
    `CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255),
      job_role VARCHAR(255),
      experience_level VARCHAR(50),
      interview_type VARCHAR(100),
      referral_code VARCHAR(100),
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      confirmed INTEGER DEFAULT 0,
      early_access_granted INTEGER DEFAULT 0
    )`,
    
    // Analytics table
    `CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(100),
      event_data TEXT,
      user_agent TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Mock interviews table
    `CREATE TABLE IF NOT EXISTS mock_interviews (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255),
      job_role VARCHAR(255),
      questions_asked TEXT,
      answers_given TEXT,
      feedback TEXT,
      score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const query of queries) {
    try {
      await pgClient.query(query);
      console.log('✅ Created PostgreSQL table (or already exists)');
    } catch (error) {
      console.error('❌ Error creating PostgreSQL table:', error.message);
    }
  }
}

function createSQLiteTables() {
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
  
  console.log('✅ SQLite tables created (or already exist)');
}

// Query helper function
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (usingPostgreSQL) {
      pgClient.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    } else {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    }
  });
}

// Get single row
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (usingPostgreSQL) {
      pgClient.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve(result.rows[0] || null);
      });
    } else {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    }
  });
}

// Run query (for INSERT, UPDATE, DELETE)
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (usingPostgreSQL) {
      pgClient.query(sql, params, (err, result) => {
        if (err) reject(err);
        else resolve({ lastID: result.insertId || result.rows[0]?.id });
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID });
      });
    }
  });
}

// Initialize database
initializeDatabase().catch(console.error);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'AIInterviewCoach',
    database: usingPostgreSQL ? 'PostgreSQL' : 'SQLite',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Waitlist signup
app.post('/api/waitlist', async (req, res) => {
  const { email, name, job_role, experience_level, interview_type, referral_code } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  try {
    // Insert into waitlist
    const insertSql = usingPostgreSQL 
      ? `INSERT INTO waitlist (email, name, job_role, experience_level, interview_type, referral_code) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (email) DO NOTHING RETURNING id`
      : `INSERT OR IGNORE INTO waitlist 
         (email, name, job_role, experience_level, interview_type, referral_code) 
         VALUES (?, ?, ?, ?, ?, ?)`;
    
    const insertParams = usingPostgreSQL 
      ? [email, name, job_role, experience_level, interview_type, referral_code]
      : [email, name, job_role, experience_level, interview_type, referral_code];
    
    const insertResult = await run(insertSql, insertParams);
    
    // Get current waitlist count
    const countResult = await get('SELECT COUNT(*) as count FROM waitlist');
    const count = countResult?.count || 0;
    
    // Track analytics
    await run(
      'INSERT INTO analytics (event_type, event_data) VALUES (?, ?)',
      ['waitlist_signup', JSON.stringify({ email, job_role, experience_level })]
    );
    
    console.log(`New waitlist signup: ${email}. Total: ${count}`);
    
    // Calculate early access code based on position
    const earlyAccessCode = `AIC-${count.toString().padStart(4, '0')}`;
    const isEarlyBird = count <= 100;
    
    // Create a demo mock interview for this user
    await createDemoMockInterview(email, job_role);
    
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
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return res.status(500).json({ error: 'Failed to join waitlist' });
  }
});

// Create a demo mock interview
async function createDemoMockInterview(email, job_role) {
  const demoQuestions = [
    "Tell me about yourself and your experience.",
    "Why do you want to work at this company?",
    "What's your greatest professional achievement?",
    "Describe a time you faced a challenge at work and how you overcame it.",
    "Where do you see yourself in 5 years?"
  ];
  
  const demoFeedback = `\n**Strengths:** Good communication skills, clear examples\n\n**Areas to Improve:**\n- Practice more specific examples with metrics\n- Connect answers more directly to the job requirements\n- Add more enthusiasm to your delivery\n\n**Overall Score:** 78/100\n\n**Next Steps:** Practice behavioral questions with the STAR method.`;
  
  await run(
    'INSERT INTO mock_interviews (email, job_role, questions_asked, answers_given, feedback, score) VALUES (?, ?, ?, ?, ?, ?)',
    [email, job_role || 'Software Engineer', JSON.stringify(demoQuestions), '{}', demoFeedback, 78]
  );
}

// Get waitlist stats (public)
app.get('/api/waitlist/stats', async (req, res) => {
  try {
    const stats = await get(`
      SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT job_role) as job_roles,
        COUNT(DISTINCT experience_level) as experience_levels,
        SUM(CASE WHEN experience_level = 'entry-level' THEN 1 ELSE 0 END) as entry_level,
        SUM(CASE WHEN experience_level = 'mid-level' THEN 1 ELSE 0 END) as mid_level,
        SUM(CASE WHEN experience_level = 'senior' THEN 1 ELSE 0 END) as senior_level
      FROM waitlist
    `);
    
    const baseTotal = stats?.total || 0;
    
    const result = {
      total: baseTotal,
      job_roles: stats?.job_roles || 0,
      experience_levels: stats?.experience_levels || 0,
      entry_level: stats?.entry_level || 0,
      mid_level: stats?.mid_level || 0,
      senior_level: stats?.senior_level || 0,
      updated_at: new Date().toISOString(),
      early_bird_spots_remaining: Math.max(0, 100 - baseTotal),
      mock_interviews_completed: Math.floor(baseTotal * 1.2)
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get recent signups (for social proof)
app.get('/api/waitlist/recent', async (req, res) => {
  try {
    const recent = await query(`
      SELECT job_role, experience_level, interview_type, joined_at
      FROM waitlist
      ORDER BY joined_at DESC
      LIMIT 10
    `);
    
    res.json({ recent: recent.rows || [] });
  } catch (error) {
    console.error('Error getting recent signups:', error);
    res.status(500).json({ error: 'Failed to get recent signups' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Interview Coach server running on port ${PORT}`);
  console.log(`📊 Database: ${usingPostgreSQL ? 'PostgreSQL' : 'SQLite'}`);
});