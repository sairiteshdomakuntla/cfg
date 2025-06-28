const express = require('express');
const path = require('path');
const { getUserData } = require('../../controllers/userController');
const userAuth = require('../../middleware/userAuth'); // No .js needed in CommonJS

const router = express.Router();
router.get('/get-user-data', userAuth, getUserData);

module.exports = router;