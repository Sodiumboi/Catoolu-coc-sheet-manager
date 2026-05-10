// ============================================================
// Database Connection Pool
// 'pg' is the PostgreSQL library for Node.js
// A 'pool' reuses connections instead of opening a new one
// every time — much more efficient
// ============================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the connection when this file is first loaded
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Check your .env file — DB_USER and DB_NAME must be correct');
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release(); // return the connection back to the pool
  }
});

module.exports = pool;
