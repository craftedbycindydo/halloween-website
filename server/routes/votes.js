const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Fetch votes or check status
router.get('/', async (req, res) => {
  const { checkStatus, adminPassword } = req.query;
  const deviceId = req.headers['x-device-id'];

  try {
    // Check vote status
    if (checkStatus === '1') {
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID required' });
      }

      const [votes] = await db.query(
        'SELECT contestant_id as contestantId, voter_name as voterName, has_changed as hasChanged FROM votes WHERE device_id = ?',
        [deviceId]
      );

      return res.json({
        hasVoted: votes.length > 0,
        vote: votes.length > 0 ? votes[0] : null
      });
    }

    // Get all votes (admin)
    if (adminPassword) {
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const [votes] = await db.query(`
        SELECT 
          v.id,
          v.contestant_id as contestantId,
          v.voter_name as voterName,
          v.device_id as deviceId,
          v.timestamp,
          v.has_changed as hasChanged,
          c.name as contestantName
        FROM votes v
        LEFT JOIN contestants c ON v.contestant_id = c.id
        ORDER BY v.created_at DESC
      `);
      return res.json(votes);
    }

    // Get vote counts (public)
    const [counts] = await db.query(`
      SELECT contestant_id as contestantId, COUNT(*) as count 
      FROM votes 
      GROUP BY contestant_id
    `);
    res.json(counts);

  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// POST - Submit or change vote
router.post('/', async (req, res) => {
  const { contestantId, voterName } = req.body;
  const deviceId = req.headers['x-device-id'];

  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID required in headers' });
  }

  if (!contestantId || !voterName) {
    return res.status(400).json({ error: 'Missing required fields: contestantId, voterName' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if device has already voted
    const [existingVotes] = await connection.query(
      'SELECT * FROM votes WHERE device_id = ?',
      [deviceId]
    );

    const existingVote = existingVotes[0];

    // If already voted and changed, don't allow another change
    if (existingVote && existingVote.has_changed) {
      await connection.rollback();
      return res.status(403).json({ 
        error: 'You have already changed your vote. No more changes allowed.' 
      });
    }

    if (existingVote) {
      // Update existing vote (first change)
      await connection.query(
        `UPDATE votes 
         SET contestant_id = ?, voter_name = ?, timestamp = ?, has_changed = TRUE 
         WHERE device_id = ?`,
        [contestantId, voterName, Date.now(), deviceId]
      );

      await connection.commit();
      return res.json({
        message: 'Vote changed successfully',
        changed: true,
        locked: true
      });
    } else {
      // Insert new vote
      await connection.query(
        'INSERT INTO votes (contestant_id, voter_name, device_id, timestamp, has_changed) VALUES (?, ?, ?, ?, FALSE)',
        [contestantId, voterName, deviceId, Date.now()]
      );

      await connection.commit();
      return res.status(201).json({
        message: 'Vote submitted successfully',
        changed: false,
        locked: false
      });
    }
  } catch (error) {
    await connection.rollback();
    
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Contestant not found' });
    }
    
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  } finally {
    connection.release();
  }
});

module.exports = router;

