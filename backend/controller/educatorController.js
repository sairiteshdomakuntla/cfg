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

const getStudentById = async (req, res) => {
    // Check if requester is educator
    console.log("Here");
    if (req.user.role !== 'Educator') {
        return res.status(403).json({
            message: "Only educators can view student details",
            status: "error"
        });
    }

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Student ID is required",
            status: "error"
        });
    }

    try {
        // Find the student user
        const student = await User.findOne({ _id: id, role: 'Student' }).select('-password');
        
        if (!student) {
            return res.status(404).json({
                message: "Student not found",
                status: "error"
            });
        }
        
        // Find the student profile
        const studentProfile = await StudentProfile.findOne({ userId: id });
        
        // Combine user and profile data
        const enrichedStudent = {
            _id: student._id,
            name: student.name,
            username: student.username,
            email: student.email,
            role: student.role,
            createdAt: student.createdAt,
            studentId: studentProfile?.studentId || 'N/A',
            age: studentProfile?.age || 'N/A',
            class: studentProfile?.class || 'N/A'
        };
        
        res.status(200).json({
            message: "Student details retrieved successfully",
            status: "success",
            data: enrichedStudent
        });
    } catch (err) {
        console.error("Error retrieving student details:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

const updateStudent = async (req, res) => {
  console.log("Update student request received");
  try {
    const {
      studentId,
      school,
      parent_phone,
      family_no,
      family_income,
      marks,
      feedbacks
    } = req.body;

    console.log(req.body);

    const student = await StudentProfile.findOne({userId: studentId});
    if (!student) {
        console.log("Student not found with ID:", studentId);
      return res.status(404).json({ error: 'Student not found' });
    }


    if (school !== undefined && school !== null) student.school = school;
    if (parent_phone !== undefined && parent_phone !== null) student.parent_phone = parent_phone;
    if (family_no !== undefined && family_no !== null) student.family_no = parseInt(family_no);
    if (family_income !== undefined && family_income !== null) student.family_income = parseFloat(family_income);

    // 🔧 Fix: Initialize marks if not present
    if (!student.marks) {
      student.marks = { maths: [], science: [], social: [] };
    }

    // Update subject-wise marks
    if (marks && typeof marks === 'object') {
      ['maths', 'science', 'social'].forEach((subject) => {
        if (marks[subject] !== undefined && marks[subject] !== null) {
          if (!Array.isArray(student.marks[subject])) {
            student.marks[subject] = [];
          }
          student.marks[subject].push(Number(marks[subject]));
        }
      });
    }

    // Append feedbacks
    if (Array.isArray(feedbacks)) {
      if (!Array.isArray(student.feedbacks)) {
        student.feedbacks = [];
      }
      student.feedbacks.push(...feedbacks);
    }

    const updated = await student.save();
    console.log("Student updated successfully:", updated);
    res.status(200).json({ message: 'Student updated successfully', student: updated });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error while updating student' });
  }
};


// Update the exports to include the new function
module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
};