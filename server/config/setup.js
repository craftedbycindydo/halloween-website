const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🎃 Halloween Contest - Database Setup 👻');
  console.log('==========================================\n');

  // Parse DATABASE_URL if provided (Railway format)
  let dbConfig;
  let dbName;

  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      port: parseInt(url.port) || 3306,
    };
    dbName = url.pathname.slice(1); // Remove leading /
  } else {
    dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
    };
    dbName = process.env.DB_NAME || 'halloween_contest';
  }

  const connection = await mysql.createConnection(dbConfig);

  try {
    // Create database
    console.log('Creating database...');
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database '${dbName}' created/verified\n`);

    // Use database
    await connection.query(`USE \`${dbName}\``);

    // Create contestants table
    console.log('Creating contestants table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contestants (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        costume VARCHAR(255) NOT NULL,
        imageUrl LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Contestants table created\n');

    // Create votes table
    console.log('Creating votes table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contestant_id VARCHAR(50) NOT NULL,
        voter_name VARCHAR(255) NOT NULL,
        device_id VARCHAR(255) NOT NULL,
        timestamp BIGINT NOT NULL,
        has_changed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_device (device_id),
        FOREIGN KEY (contestant_id) REFERENCES contestants(id) ON DELETE CASCADE,
        INDEX idx_device (device_id),
        INDEX idx_contestant (contestant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Votes table created\n');

    console.log('==========================================');
    console.log('✅ Setup completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Start the server: npm start');
    console.log('2. Visit: http://localhost:3000\n');
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'SpookyAdmin2024!'}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase().then(() => process.exit(0));
}

module.exports = setupDatabase;

