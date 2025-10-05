const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all movies
router.get('/', async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM movies');
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const [movies] = await db.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
    
    if (movies.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movies[0]);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
