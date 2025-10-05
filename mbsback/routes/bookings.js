const express = require('express');
const router = express.Router();
const db = require('../db');

// -------------------------------
// Create a new booking
// -------------------------------
router.post('/', async (req, res) => {
  const connection = await db.getConnection(); // Get a connection for transaction
  try {
    const { user_id, show_id, seats, total_amount } = req.body;
    console.log('Booking Request:', req.body);

    if (!user_id || !show_id || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Missing or invalid booking details' });
    }
    

    // Start transaction
    await connection.beginTransaction();

    // Create booking with payment_status = 'completed' (can modify later)
    const [bookingResult] = await connection.query(
      `INSERT INTO bookings (user_id, show_id, total_amount, payment_status) 
       VALUES (?, ?, ?, ?)`,
      [user_id, show_id, total_amount, 'completed']
    );

    const booking_id = bookingResult.insertId;

    // Insert booked seats (seat_number only)
    for (const seat of seats) {
      await connection.query(
        `INSERT INTO booking_seats (booking_id, seat_number) VALUES (?, ?)`,
        [booking_id, seat]
      );
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      message: 'Booking created successfully',
      booking_id,
    });
  } catch (error) {
    await connection.rollback(); // Rollback transaction on error
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    connection.release(); // Release connection back to pool
  }
});

// -------------------------------
// Get all bookings by user ID
// -------------------------------
router.get('/user/:id', async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, s.show_time, m.title AS movie_title, m.poster, c.name AS cinema_name
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN cinemas c ON s.cinema_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.booked_at DESC`,
      [req.params.id]
    );

    // Fetch seat numbers for each booking
    for (let booking of bookings) {
      const [seats] = await db.query(
        `SELECT seat_number FROM booking_seats WHERE booking_id = ?`,
        [booking.id]
      );
      booking.seats = seats.map(s => s.seat_number);
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// -------------------------------
// Get all booked seats for a specific show
// -------------------------------
router.get('/show/:showId/seats', async (req, res) => {
  try {
    const showId = req.params.showId;

    const [seats] = await db.query(
      `SELECT seat_number 
       FROM booking_seats bs
       JOIN bookings b ON bs.booking_id = b.id
       WHERE b.show_id = ?`,
      [showId]
    );

    console.log('Fetched seats:', seats);

    const bookedSeats = seats.map(s => s.seat_number);

    // Send JSON response
    res.json({ bookedSeats });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// -------------------------------
// Get booking by booking ID
// -------------------------------
router.get('/:id', async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, s.show_time, m.title AS movie_title, m.poster, c.name AS cinema_name
       FROM bookings b
       JOIN shows s ON b.show_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN cinemas c ON s.cinema_id = c.id
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Fetch seat numbers
    const [seats] = await db.query(
      `SELECT seat_number FROM booking_seats WHERE booking_id = ?`,
      [booking.id]
    );
    booking.seats = seats.map(s => s.seat_number);

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
