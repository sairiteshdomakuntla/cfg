const express = require('express');
const { createStudent, getAllStudents } = require('../../controller/educatorController');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();

router.post('/create-student', userAuth, createStudent);
router.get('/students', userAuth, getAllStudents);

module.exports = router;