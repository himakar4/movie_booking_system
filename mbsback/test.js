const db = require('./db');

async function test() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Connection successful:', rows);
  } catch (err) {
    console.error('Error connecting:', err);
  }
}

test();
