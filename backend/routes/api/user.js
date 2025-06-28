const express = require('express');
const path = require('path');
const { getUserData } = require('../../controller/userController');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();
router.get('/get-user-data', userAuth, getUserData);

module.exports = router;