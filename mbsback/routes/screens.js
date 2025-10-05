const express = require('express');
const router = express.Router();

// Get all screens for a cinema
router.get('/cinema/:cinemaId', async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const db = req.app.locals.db;
    
    const query = 'SELECT * FROM screens WHERE cinema_id = ?';
    db.query(query, [cinemaId], (err, results) => {
      if (err) {
        console.error('Error fetching screens:', err);
        return res.status(500).json({ message: 'Error fetching screens' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get screen by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    const query = 'SELECT * FROM screens WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error fetching screen:', err);
        return res.status(500).json({ message: 'Error fetching screen' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Screen not found' });
      }
      
      res.json(results[0]);
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new screen
router.post('/', async (req, res) => {
  try {
    const { name, cinema_id, capacity } = req.body;
    const db = req.app.locals.db;
    
    if (!name || !cinema_id || !capacity) {
      return res.status(400).json({ message: 'Name, cinema_id, and capacity are required' });
    }
    
    const query = 'INSERT INTO screens (name, cinema_id, capacity) VALUES (?, ?, ?)';
    db.query(query, [name, cinema_id, capacity], (err, result) => {
      if (err) {
        console.error('Error creating screen:', err);
        return res.status(500).json({ message: 'Error creating screen' });
      }
      
      res.status(201).json({
        id: result.insertId,
        name,
        cinema_id,
        capacity,
        message: 'Screen created successfully'
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update screen
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;
    const db = req.app.locals.db;
    
    if (!name || !capacity) {
      return res.status(400).json({ message: 'Name and capacity are required' });
    }
    
    const query = 'UPDATE screens SET name = ?, capacity = ? WHERE id = ?';
    db.query(query, [name, capacity, id], (err, result) => {
      if (err) {
        console.error('Error updating screen:', err);
        return res.status(500).json({ message: 'Error updating screen' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Screen not found' });
      }
      
      res.json({ message: 'Screen updated successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete screen
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    
    const query = 'DELETE FROM screens WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting screen:', err);
        return res.status(500).json({ message: 'Error deleting screen' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Screen not found' });
      }
      
      res.json({ message: 'Screen deleted successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;