const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',       // your MySQL host
  user: 'root',            // your MySQL username
  password: 'newpassword', // your MySQL password
  database: 'squidgames_db' // the database you used for login
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// POST /vote — record a vote
app.post('/vote', (req, res) => {
  const { vote, userId } = req.body;

  // Basic validation
  const allowed = new Set(['yes', 'maybe', 'no']);
  if (!allowed.has(vote)) {
    return res.status(400).json({ message: 'Invalid vote. Use yes/maybe/no.' });
  }

  // Check if this user already voted
  const checkSql = 'SELECT * FROM poll_votes WHERE user_id = ?';
  db.query(checkSql, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'DB error', detail: err.message });
      }

      if (results.length > 0) {
          return res.json({ message: 'You have already voted' });
      }

      // If user hasn't voted, insert the vote
      const insertSql = 'INSERT INTO poll_votes (user_id, vote) VALUES (?, ?)';
      db.query(insertSql, [userId, vote], (err) => {
          if (err) {
              return res.status(500).json({ message: 'DB error', detail: err.message });
          }
          return res.json({ message: '✅ Vote recorded' });
      });
  });
});


// GET /vote — list all votes
app.get('/vote', (req, res) => {
  const sql = 'SELECT * FROM poll_votes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error while fetching votes:', err);
      return res.status(500).json({ message: 'DB error', detail: err.message });
    }
    return res.json(results);
  });
});

// DELETE /vote/id/:id — delete a vote by ID
app.delete('/vote/id/:id', (req, res) => {
  const voteId = req.params.id;

  const sql = 'DELETE FROM poll_votes WHERE id = ?';
  db.query(sql, [voteId], (err, result) => {
    if (err) {
      console.error('DB error while deleting vote:', err);
      return res.status(500).json({ message: 'DB error', detail: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    return res.json({ message: `✅ Vote with ID ${voteId} deleted` });
  });
});



// POST /api/save-role — save user's role after quiz
app.post('/api/save-role', (req, res) => {
    const { username, role } = req.body;

    if (!username || !role) {
        return res.status(400).json({ message: 'Username and role are required' });
    }

    const sql = 'INSERT INTO user_roles (username, role) VALUES (?, ?)';
    db.query(sql, [username, role], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ message: 'Role saved successfully' });
    });
});

// GET /api/role-percentages — get role percentages
app.get('/api/role-percentages', (req, res) => {
    const sql = 'SELECT role, COUNT(*) as count FROM user_roles GROUP BY role';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Calculate total users
        const total = results.reduce((sum, row) => sum + row.count, 0);
        const percentages = {};
        results.forEach(row => {
            percentages[row.role] = ((row.count / total) * 100).toFixed(1);
        });

        res.json({ percentages });
    });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});