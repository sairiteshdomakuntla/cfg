const fsPromises = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const db = path.join(__dirname, '..', 'data', 'users.json');
const usersDB = {
    users: require(db),
    setUsers: function (data) { this.users = data; }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Username, password, and name are required",
            status: "error"
        });
    }

    const existingUser = usersDB.users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({
            message: "Username already exists",
            status: "error"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    usersDB.setUsers([...usersDB.users, { name, username, password: hashedPassword }]);

    try {
        await fsPromises.writeFile(
            db,
            JSON.stringify(usersDB.users)
        );
    } catch (err) {
        console.error("Error writing to users.json:", err);
        return res.status(500).json({
            message: "Internal server error",
            status: "error"
        });
    }

    const token = jwt.sign(
        { username },
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
        data: { username }
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
            status: "error"
        });
    }

    const user = usersDB.users.find(user => user.username === username);
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
        { username },
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
        data: { username }
    });
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
            data: { username: req.body.username }
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
