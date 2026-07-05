const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    const { username, email, password, fullname } = req.body;

    if (!username || !email || !password || !fullname) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExists = await userModel.findOne(
        {
            $or: [
                { username },
                { email }
            ]
        }
    );

    if (isUserExists) {
        return res.status(400).json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullname
    })

    const token = jwt.sign(
        {
            userId: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    )

    res.cookie("token", token,)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        },
    })

}


const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    const user = await userModel.findOne(
        {
            $or: [
                { email },
                { username }
            ]
        }
    );

    if (!user) {
        return res.status(400).json({ message: "Invalid username or email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        {
            userId: user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }

    )

    res.cookie("token", token,)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        },
    })

}


const logoutUser = async (req, res) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blacklistModel.create({ token });

    res.clearCookie("token");

    res.status(200).json(
        {
            message: "User logged out successfully",
        }

    );
}


const getMe = async (req, res) => {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User information retrieved successfully",
        user: {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}