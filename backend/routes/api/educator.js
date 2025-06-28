const express = require('express');
const { createStudent, getAllStudents, getStudentById, updateStudent, visualdata } = require('../../controller/educatorController');
const userAuth = require('../../middleware/userAuth');

const router = express.Router();

router.post('/create-student', userAuth, createStudent);
router.get('/students', userAuth, getAllStudents);
router.get('/students/:id', userAuth, getStudentById);  // New route for individual student
router.post('/students/edit', userAuth, updateStudent); // Assuming this is for editing a student
router.post('/students/visualdata', userAuth, visualdata); // Assuming this is for editing a student

module.exports = router;