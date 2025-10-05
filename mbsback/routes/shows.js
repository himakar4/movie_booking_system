const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all shows
router.get('/', async (req, res) => {
  try {
    const [shows] = await db.query(`
      SELECT s.*, m.title AS movie_title, m.poster AS poster, c.name AS cinema_name
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN cinemas c ON s.cinema_id = c.id
    `);
    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shows by movie ID
router.get('/movie/:id', async (req, res) => {
  try {
    const [shows] = await db.query(`
      SELECT s.id, s.show_time, 
             m.id AS movie_id, m.title AS movie_title, m.poster AS poster,
             c.id AS cinema_id, c.name AS cinema_name, c.location
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN cinemas c ON s.cinema_id = c.id
      WHERE s.movie_id = ?
      ORDER BY s.show_time ASC
    `, [req.params.id]);

    res.json(shows);
  } catch (error) {
    console.error('Error fetching shows by movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get show by ID
router.get('/:id', async (req, res) => {
  try {
    const [shows] = await db.query(`
      SELECT s.*, m.title AS movie_title, m.poster AS poster, c.name AS cinema_name
      FROM shows s
      JOIN movies m ON s.movie_id = m.id
      JOIN cinemas c ON s.cinema_id = c.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (shows.length === 0) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json(shows[0]);
  } catch (error) {
    console.error('Error fetching show:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
