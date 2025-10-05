const mysql = require('mysql2');

// Create a pool for better performance
const pool = mysql.createPool({
  host: '127.0.0.1',   // or 'localhost'
  user: 'root',         // default XAMPP MySQL user
  password: '',         // default is empty
  database: 'movie_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export pool with promise support
module.exports = pool.promise();
