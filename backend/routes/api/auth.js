const express = require('express');
const path = require('path');
const { login, logout, isAuthenticated } = require('../../controller/authController');
const userAuth = require('../../middleware/userAuth'); // No .js needed in CommonJS


const router = express.Router();

// Remove the register route
router.post('/login', login);
router.get('/logout', logout);
router.get('/is-auth', userAuth, isAuthenticated);

module.exports = router;
