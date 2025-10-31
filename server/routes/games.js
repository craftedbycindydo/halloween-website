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

// Get all games with winner counts
router.get('/', async (req, res) => {
  try {
    const [games] = await pool.query(`
      SELECT g.*, COUNT(gw.id) as winner_count
      FROM games g
      LEFT JOIN game_winners gw ON g.id = gw.game_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
    `);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Get game winners for a specific game
router.get('/:gameId/winners', async (req, res) => {
  try {
    const { gameId } = req.params;
    const [winners] = await pool.query(`
      SELECT gw.*, c.name, c.costume, c.imageUrl
      FROM game_winners gw
      JOIN contestants c ON gw.contestant_id = c.id
      WHERE gw.game_id = ?
      ORDER BY gw.created_at DESC
    `, [gameId]);
    res.json(winners);
  } catch (error) {
    console.error('Error fetching game winners:', error);
    res.status(500).json({ error: 'Failed to fetch game winners' });
  }
});

// Get overall leaderboard (contestants with their total game wins)
router.get('/leaderboard/overall', async (req, res) => {
  try {
    const [leaderboard] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.costume,
        c.imageUrl,
        COUNT(gw.id) as total_wins
      FROM contestants c
      LEFT JOIN game_winners gw ON c.id = gw.contestant_id
      GROUP BY c.id, c.name, c.costume, c.imageUrl
      HAVING total_wins > 0
      ORDER BY total_wins DESC, c.name ASC
    `);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Create a new game
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Game name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO games (name) VALUES (?)',
      [name]
    );

    const [newGame] = await pool.query(
      'SELECT * FROM games WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newGame[0]);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Add winner to a game
router.post('/:gameId/winners', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { contestantId } = req.body;

    if (!contestantId) {
      return res.status(400).json({ error: 'Contestant ID is required' });
    }

    // Check if game exists
    const [game] = await pool.query('SELECT * FROM games WHERE id = ?', [gameId]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Check if contestant exists
    const [contestant] = await pool.query('SELECT * FROM contestants WHERE id = ?', [contestantId]);
    if (contestant.length === 0) {
      return res.status(404).json({ error: 'Contestant not found' });
    }

    // Add winner
    const [result] = await pool.query(
      'INSERT INTO game_winners (game_id, contestant_id) VALUES (?, ?)',
      [gameId, contestantId]
    );

    const [newWinner] = await pool.query(`
      SELECT gw.*, c.name, c.costume, c.imageUrl
      FROM game_winners gw
      JOIN contestants c ON gw.contestant_id = c.id
      WHERE gw.id = ?
    `, [result.insertId]);

    res.status(201).json(newWinner[0]);
  } catch (error) {
    console.error('Error adding game winner:', error);
    res.status(500).json({ error: 'Failed to add game winner' });
  }
});

// Delete a game
router.delete('/:gameId', verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const [result] = await pool.query('DELETE FROM games WHERE id = ?', [gameId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// Remove winner from a game
router.delete('/:gameId/winners/:winnerId', verifyAdmin, async (req, res) => {
  try {
    const { gameId, winnerId } = req.params;
    
    const [result] = await pool.query(
      'DELETE FROM game_winners WHERE id = ? AND game_id = ?',
      [winnerId, gameId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Winner not found' });
    }

    res.json({ message: 'Winner removed successfully' });
  } catch (error) {
    console.error('Error removing winner:', error);
    res.status(500).json({ error: 'Failed to remove winner' });
  }
});

module.exports = router;

