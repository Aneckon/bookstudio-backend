const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await pool.oneOrNone(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email],
    );
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING users';
    const values = [email, username, hashedPassword];
    const result = await pool.query(query, values);
    const userId = jwt.sign({ user: result[0] }, 'your-secret-key');
    res.json({ userId });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key');
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
};
