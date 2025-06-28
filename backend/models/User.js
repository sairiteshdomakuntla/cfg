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