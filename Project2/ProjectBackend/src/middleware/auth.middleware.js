const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    const isBlacklistedToken = await blacklistModel.findOne({ token });

    if (isBlacklistedToken) {
        return res.status(401).json({ message: "Token is blacklisted" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

    next();
}

module.exports = authMiddleware;