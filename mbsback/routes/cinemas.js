const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all cinemas
router.get('/', async (req, res) => {
  try {
    const [cinemas] = await db.query('SELECT * FROM cinemas');
    res.json(cinemas);
  } catch (error) {
    console.error('Error fetching cinemas:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cinema by ID
router.get('/:id', async (req, res) => {
  try {
    const [cinemas] = await db.query('SELECT * FROM cinemas WHERE id = ?', [req.params.id]);
    
    if (cinemas.length === 0) {
      return res.status(404).json({ message: 'Cinema not found' });
    }
    
    res.json(cinemas[0]);
  } catch (error) {
    console.error('Error fetching cinema:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get screens by cinema ID
router.get('/:id/screens', async (req, res) => {
  try {
    const [screens] = await db.query('SELECT * FROM screens WHERE cinema_id = ?', [req.params.id]);
    res.json(screens);
  } catch (error) {
    console.error('Error fetching screens:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
