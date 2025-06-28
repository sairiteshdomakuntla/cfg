const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dropEmailIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection;
        
        // Drop the email index from the users collection
        await db.collection('users').dropIndex('email_1');
        console.log('Successfully dropped email index from users collection');
        
    } catch (error) {
        console.error('Error dropping index:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

dropEmailIndex();