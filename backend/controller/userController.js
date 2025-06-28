const mongoose = require('mongoose');
const User = require('../models/User');

const getUserData = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Username is required",
            status: "error"
        });
    }

    try {
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "error"
            });
        }

        res.status(200).json({
            message: "User data retrieved successfully",
            status: "success",
            user: {
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Error retrieving user data:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }
}

module.exports = { getUserData };