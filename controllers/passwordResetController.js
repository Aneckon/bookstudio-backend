const pool = require('../db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');

const transporter = nodemailer.createTransport({
  service: 'your-email-service-provider',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password'
  }
});

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = generateResetToken(user.id);
    const resetLink = `http://your-app-url/reset/${token}`;

    sendResetEmail(email, resetLink);

    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const generateResetToken = (userId) => {
  return jwt.sign({ userId }, 'fdgsfghgdjfgkjghkhklkj', { expiresIn: '1h' });
};

const sendResetEmail = (email, resetLink) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, click on the following link: ${resetLink}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  requestReset
};
