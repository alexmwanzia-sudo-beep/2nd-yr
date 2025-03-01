const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Test MySQL connection
db.connect((err) => {
  if (err) {
    console.log('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Sign Up Route
app.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Internal Server Error');
    }
    return res.status(201).send('User registered successfully');
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return res.status(400).send('Invalid email or password');
    }

    const user = results[0];

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send('Invalid email or password');
    }

    // Create JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token to the client
    return res.status(200).json({ token });
  });
});

// Set PORT with a default fallback
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
