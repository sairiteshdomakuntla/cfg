const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            name: 'System Administrator',
            username: 'admin',
            email: 'admin@example.com', // Add email field
            password: hashedPassword,
            role: 'Admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminUser();