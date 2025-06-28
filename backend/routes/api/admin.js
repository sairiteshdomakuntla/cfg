const express = require('express');
const { createEducator, getAllEducators } = require('../../controller/adminController');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();

router.post('/create-educator', userAuth, createEducator);
router.get('/educators', userAuth, getAllEducators);

module.exports = router;