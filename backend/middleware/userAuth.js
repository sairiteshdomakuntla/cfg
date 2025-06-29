const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuth = async (req, res, next) => {
    console.log('authhh',req)
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    console.log('Token:', token); // Debugging line to check the token value
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        if(decode.username) {
            // Get the full user from database
            const user = await User.findOne({ username: decode.username }).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            // Store the full user object in req.user
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = userAuth;