const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createStudent = async (req, res) => {
    const { name, username, password } = req.body;

    // Check if requester is educator
    if (req.user.role !== 'Educator') {
        return res.status(403).json({
            message: "Only educators can create students",
            status: "error"
        });
    }

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Name, username, and password are required",
            status: "error"
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists",
                status: "error"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newStudent = new User({
            name,
            username,
            email: `${username}@example.com`, // Generate a default email based on username
            password: hashedPassword,
            role: 'Student'
        });

        await newStudent.save();

        res.status(201).json({
            message: "Student created successfully",
            status: "success",
            data: { 
                name: newStudent.name,
                username: newStudent.username,
                role: newStudent.role 
            }
        });
    } catch (err) {
        console.error("Error creating student:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

const getAllStudents = async (req, res) => {
    // Check if requester is educator
    if (req.user.role !== 'Educator') {
        return res.status(403).json({
            message: "Only educators can view students",
            status: "error"
        });
    }

    try {
        const students = await User.find({ role: 'Student' }).select('-password');
        
        res.status(200).json({
            message: "Students retrieved successfully",
            status: "success",
            data: students
        });
    } catch (err) {
        console.error("Error retrieving students:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

module.exports = {
    createStudent,
    getAllStudents
};