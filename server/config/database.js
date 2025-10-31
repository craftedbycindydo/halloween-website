const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse DATABASE_URL if provided (Railway format)
// Format: mysql://user:password@host:port/database
let dbConfig;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading /
    port: parseInt(url.port) || 3306,
  };
} else {
  // Fallback to individual environment variables
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'halloween_contest',
    port: parseInt(process.env.DB_PORT) || 3306,
  };
}

// Create connection pool
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  maxAllowedPacket: 64 * 1024 * 1024 // 64MB for large base64 images
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;

