const fsPromises = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const login = async (req, res) => {
    const { username, password } = req.body;

    console.log('Login attempt:', { username }); // Debug log

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
            status: "error"
        });
    }

    try {
        const user = await User.findOne({ username });
        console.log('User found:', user ? 'Yes' : 'No'); // Debug log
        
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
                status: "error"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid); // Debug log
        
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
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log('Login successful for:', username, 'Role:', user.role); // Debug log

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

// Update the isAuthenticated function
const isAuthenticated = (req, res) => {
    try {
        return res.json({
            message: "User is authenticated",
            status: "success",
            data: { 
                username: req.user.username, 
                role: req.user.role,
                name: req.user.name
            }
        });
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            status: "error"
        });
    }
}

module.exports = {
    login,
    logout,
    isAuthenticated
}
