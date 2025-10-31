const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Verify admin password middleware
const verifyAdmin = (req, res, next) => {
  const adminPassword = req.body.adminPassword || req.query.adminPassword;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get contest winner settings
router.get('/winner', async (req, res) => {
  try {
    const [settings] = await pool.query(`
      SELECT cs.*, c.name, c.costume, c.imageUrl
      FROM contest_settings cs
      LEFT JOIN contestants c ON cs.winner_id = c.id
      WHERE cs.id = 1
    `);
    res.json(settings[0] || { winner_published: false, winner_id: null });
  } catch (error) {
    console.error('Error fetching contest winner:', error);
    res.status(500).json({ error: 'Failed to fetch contest winner' });
  }
});

// Set contest winner and publish
router.post('/winner', verifyAdmin, async (req, res) => {
  try {
    const { contestantId, publish } = req.body;

    if (!contestantId) {
      return res.status(400).json({ error: 'Contestant ID is required' });
    }

    // Check if contestant exists
    const [contestant] = await pool.query('SELECT * FROM contestants WHERE id = ?', [contestantId]);
    if (contestant.length === 0) {
      return res.status(404).json({ error: 'Contestant not found' });
    }

    // Update contest settings
    await pool.query(
      'UPDATE contest_settings SET winner_id = ?, winner_published = ? WHERE id = 1',
      [contestantId, publish ? 1 : 0]
    );

    const [updated] = await pool.query(`
      SELECT cs.*, c.name, c.costume, c.imageUrl
      FROM contest_settings cs
      LEFT JOIN contestants c ON cs.winner_id = c.id
      WHERE cs.id = 1
    `);

    res.json(updated[0]);
  } catch (error) {
    console.error('Error setting contest winner:', error);
    res.status(500).json({ error: 'Failed to set contest winner' });
  }
});

// Unpublish contest winner
router.post('/winner/unpublish', verifyAdmin, async (req, res) => {
  try {
    await pool.query(
      'UPDATE contest_settings SET winner_published = 0 WHERE id = 1'
    );

    const [updated] = await pool.query(`
      SELECT cs.*, c.name, c.costume, c.imageUrl
      FROM contest_settings cs
      LEFT JOIN contestants c ON cs.winner_id = c.id
      WHERE cs.id = 1
    `);

    res.json(updated[0]);
  } catch (error) {
    console.error('Error unpublishing winner:', error);
    res.status(500).json({ error: 'Failed to unpublish winner' });
  }
});

// Clear contest winner
router.delete('/winner', verifyAdmin, async (req, res) => {
  try {
    await pool.query(
      'UPDATE contest_settings SET winner_id = NULL, winner_published = 0 WHERE id = 1'
    );

    res.json({ message: 'Contest winner cleared successfully' });
  } catch (error) {
    console.error('Error clearing winner:', error);
    res.status(500).json({ error: 'Failed to clear winner' });
  }
});

module.exports = router;

