const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if(decode.username) {
            // Store user info in req.user instead of req.body
            req.user = {
                username: decode.username,
                role: decode.role || 'Student'
            };
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = userAuth;