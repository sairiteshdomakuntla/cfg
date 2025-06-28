const fsPromises = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const register = async (req, res) => {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Username, password, and name are required",
            status: "error"
        });
    }

    // Validate role
    const validRoles = ['Student', 'Educator', 'Admin'];
    const userRole = role && validRoles.includes(role) ? role : 'Student';

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists",
                status: "error"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            role: userRole
        });

        await newUser.save();

        const token = jwt.sign(
            { username, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            status: "success",
            data: { username, role: userRole }
        });
    } catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
            status: "error"
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
                status: "error"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password",
                status: "error"
            });
        }

        const token = jwt.sign(
            { username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            status: "success",
            data: { username, role: user.role }
        });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

    res.status(200).json({
        message: "Logout successful",
        status: "success"
    });
};

const isAuthenticated = (req, res) => {
    try {
        return res.json({
            message: "User is authenticated",
            status: "success",
            data: { username: req.body.username, role: req.body.role }
        });
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            status: "error"
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    isAuthenticated
}
