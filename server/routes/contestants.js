const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Fetch all contestants
router.get('/', async (req, res) => {
  try {
    const [contestants] = await db.query(
      'SELECT id, name, costume, imageUrl FROM contestants ORDER BY created_at DESC'
    );
    res.json(contestants);
  } catch (error) {
    console.error('Error fetching contestants:', error);
    res.status(500).json({ error: 'Failed to fetch contestants' });
  }
});

// POST - Add new contestant (Admin only)
router.post('/', async (req, res) => {
  const { id, name, costume, imageUrl, adminPassword } = req.body;

  // Verify admin password
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id || !name || !costume) {
    return res.status(400).json({ error: 'Missing required fields: id, name, costume' });
  }

  try {
    await db.query(
      'INSERT INTO contestants (id, name, costume, imageUrl) VALUES (?, ?, ?, ?)',
      [id, name, costume, imageUrl || '']
    );
    res.status(201).json({ message: 'Contestant added successfully', id });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Contestant with this ID already exists' });
    }
    console.error('Error adding contestant:', error);
    res.status(500).json({ error: 'Failed to add contestant' });
  }
});

// DELETE - Delete contestant (Admin only)
router.delete('/', async (req, res) => {
  const { id, adminPassword } = req.body;

  // Verify admin password
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Missing contestant ID' });
  }

  try {
    await db.query('DELETE FROM contestants WHERE id = ?', [id]);
    res.json({ message: 'Contestant deleted successfully' });
  } catch (error) {
    console.error('Error deleting contestant:', error);
    res.status(500).json({ error: 'Failed to delete contestant' });
  }
});

module.exports = router;

