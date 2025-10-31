const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const setupDatabase = require('./config/setup');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // For base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/contestants', require('./routes/contestants'));
app.use('/api/votes', require('./routes/votes'));
app.use('/api/games', require('./routes/games'));
app.use('/api/contest', require('./routes/contest'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '🎃 Halloween Contest API is running!' });
});

// Serve static files from React app (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Auto-initialize database and start server
async function startServer() {
  try {
    console.log('');
    console.log('🎃👻 Halloween Contest Server 👻🎃');
    console.log('=====================================');
    console.log('⏳ Initializing database...');
    
    // Auto-setup database tables
    await setupDatabase();
    
    console.log('✅ Database ready!');
    console.log('=====================================');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('=====================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Please check your database configuration and try again.');
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;

