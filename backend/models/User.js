const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        // Make it unique but not required
        unique: true,
        sparse: true, // This allows null/undefined values to not trigger unique constraint
        default: null
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Educator', 'Admin'],
        required: true,
        default: 'Student'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;