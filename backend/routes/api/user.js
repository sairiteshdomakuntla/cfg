const express = require('express');
const path = require('path');
const { getUserData, getData } = require('../../controller/userController');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();
router.get('/get-user-data', userAuth, getUserData);
router.get('/get-data/:userId', getData);

module.exports = router;