const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordResetController = require('../controllers/passwordResetController');
const pool = require('../db');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/protected', authController.protected, (req, res) => {
  res.json({ message: 'Access granted' });
});
router.post('/request-reset', passwordResetController.requestReset);
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      `CREATE TABLE users ( id: varchar(255), email varchar(255), username varchar(255), password varchar(255) );`,
    );
    return res.json({ result }, { status: 200 });
  } catch (error) {
    return res.json(error);
  }
});

module.exports = router;
