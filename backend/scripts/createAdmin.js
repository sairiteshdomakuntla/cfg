const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdminUser = async () => {
    try {
        // const uri = process.env.MONGODB_URI;
        const uri = "mongodb+srv://sairiteshdomakuntla:rtz0tzNoz7flrOsa@cluster0.keuarrs.mongodb.net/"
        console.log(uri)
        await mongoose.connect(uri);

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            name: 'System Administrator',
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'Admin'
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully');
        console.log('👤 Username: admin');
        console.log('🔐 Password: admin123');
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createAdminUser();
