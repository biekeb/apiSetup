const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json()); 

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Server running on port 3000');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create a route to retrieve user data from the database
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

// Create a route to add a new user to the database
app.post('/users', (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: 'Name, age, and email are required.' });
  }

  db.run('INSERT INTO users (name, age, email) VALUES (?, ?, ?)', [name, age, email], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({ message: 'User added successfully', userId: this.lastID });
  });
});

//delete user
app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  // Check if the user with the specified ID exists in the database
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // User exists, delete them from the database
      db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'User deleted successfully' });
        }
      });
    }
  });
});

//change user 
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const { name, age, email } = req.body;

  // Check if the user with the specified ID exists in the database
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      // User exists, update their information in the database
      db.run(
        'UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?',
        [name, age, email, userId],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.json({ message: 'User updated successfully' });
          }
        }
      );
    }
  });
});
