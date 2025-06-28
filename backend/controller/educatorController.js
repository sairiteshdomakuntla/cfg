const bcrypt = require('bcryptjs');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

const createStudent = async (req, res) => {
    const { name, username, password, email, age, class: studentClass, studentId } = req.body;

    // Check if requester is educator
    if (req.user.role !== 'Educator') {
        return res.status(403).json({
            message: "Only educators can create students",
            status: "error"
        });
    }

    if (!name || !username || !password || !age || !studentClass || !studentId) {
        return res.status(400).json({
            message: "All fields are required",
            status: "error"
        });
    }

    try {
        // Check if user or studentId already exists
        const existingUser = await User.findOne({ 
            $or: [
                { username },
                { email }
            ] 
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists",
                status: "error"
            });
        }

        // Check if studentId already exists
        const existingStudentId = await StudentProfile.findOne({ studentId });
        if (existingStudentId) {
            return res.status(409).json({
                message: "Student ID already exists",
                status: "error"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the user account
        const newStudent = new User({
            name,
            username,
            email: email || `${username}@example.com`,
            password: hashedPassword,
            role: 'Student'
        });

        const savedUser = await newStudent.save();

        // Create student profile with additional information
        const studentProfile = new StudentProfile({
            userId: savedUser._id,
            studentId,
            age: Number(age),
            class: studentClass,
            createdBy: req.user._id // This would normally be the educator's ID
        });

        await studentProfile.save();

        res.status(201).json({
            message: "Student created successfully",
            status: "success",
            data: { 
                name: newStudent.name,
                username: newStudent.username,
                studentId: studentProfile.studentId,
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
        // Get all students with their profiles
        const students = await User.find({ role: 'Student' }).select('-password');
        
        // Get student profiles and create a map for easy lookup
        const studentProfiles = await StudentProfile.find({
            userId: { $in: students.map(student => student._id) }
        });
        
        const profileMap = {};
        studentProfiles.forEach(profile => {
            profileMap[profile.userId.toString()] = profile;
        });
        
        // Combine user and profile data
        const enrichedStudents = students.map(student => {
            const profile = profileMap[student._id.toString()];
            return {
                _id: student._id,
                name: student.name,
                username: student.username,
                email: student.email,
                role: student.role,
                createdAt: student.createdAt,
                studentId: profile?.studentId || 'N/A',
                age: profile?.age || 'N/A',
                class: profile?.class || 'N/A'
            };
        });
        
        res.status(200).json({
            message: "Students retrieved successfully",
            status: "success",
            data: enrichedStudents
        });
    } catch (err) {
        console.error("Error retrieving students:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

// Make sure this exports the updated functions with student profiles
module.exports = {
    createStudent,
    getAllStudents
};