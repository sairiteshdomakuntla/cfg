const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createEducator = async (req, res) => {
    const { name, username, password } = req.body;

    console.log('Create educator request from:', req.user.username, 'Role:', req.user.role);

    // Check if requester is admin
    if (req.user.role !== 'Admin') {
        return res.status(403).json({
            message: "Only admins can create educators",
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
        
        const newEducator = new User({
            name,
            username,
            email: `${username}@example.com`, // Generate a default email based on username
            password: hashedPassword,
            role: 'Educator'
        });

        await newEducator.save();

        res.status(201).json({
            message: "Educator created successfully",
            status: "success",
            data: { 
                name: newEducator.name,
                username: newEducator.username,
                role: newEducator.role 
            }
        });
    } catch (err) {
        console.error("Error creating educator:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

const getAllEducators = async (req, res) => {
    console.log('Get educators request from:', req.user.username, 'Role:', req.user.role);

    // Check if requester is admin
    if (req.user.role !== 'Admin') {
        return res.status(403).json({
            message: "Only admins can view all educators",
            status: "error"
        });
    }

    try {
        const educators = await User.find({ role: 'Educator' }).select('-password');
        
        res.status(200).json({
            message: "Educators retrieved successfully",
            status: "success",
            data: educators
        });
    } catch (err) {
        console.error("Error retrieving educators:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

module.exports = {
    createEducator,
    getAllEducators
};