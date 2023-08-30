const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordResetController = require('../controllers/passwordResetController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-reset', passwordResetController.requestReset);

module.exports = router;
