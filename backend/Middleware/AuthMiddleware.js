// middleware/auth.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function isAuthenticated(req, res, next) {
    const Auth_Header = req.headers.Authorization || req.headers.authorization;

    if (!Auth_Header || !Auth_Header.startsWith('Bearer ')) {
        return res.status(400).json({ Error: "User Not Logged In" });
    }

    const auth_token = Auth_Header.split(' ')[1];

    try {
        const token = jwt.verify(auth_token, secret);
        req.User_name = token.User_name;
        req.UserId = token.UserId;
        req.first_name = token.first_name;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = isAuthenticated;
