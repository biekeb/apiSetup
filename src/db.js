const sqlite3 = require('sqlite3').verbose();

// Open a connection to the SQLite database file
const db = new sqlite3.Database('mydb.sqlite');

// Create a table for storing user information if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER,
      email TEXT
    )
  `);
});

module.exports = db;
