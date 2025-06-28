const path = require('path');

const db = path.join(__dirname, '..', 'data', 'users.json');
const usersDB = {
    users: require(db),
    setUsers: function (data) { this.users = data; }
};

const getUserData = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Username is required",
            status: "error"
        });
    }

    const user = usersDB.users.find(user => user.username === username);
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
            username: user.username
        }
    });
}

module.exports = { getUserData };