const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')
const blackListModel = require("../models/tokenBlackList.model")

/**
 * /POST /api/auth/register
 */

const userRegisterController = async (req, res) => {
    const { email, name, password } = req.body

    const isExist = await userModel.findOne({
        email: email
    })

    if (isExist) {
        return res.status(422).json({
            message: "User already exist",
            status: "failed"
        })
    }
    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(201).json({
        message: "Your account registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)

}


/** LOGIN */


const userLoginController = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        res.status(401).json({
            message: "Invalid Creadential"
        })
    }

    const isValidPass = await user.comparePassword(password)

    if (!isValidPass) {
        res.status(401).json({
            message: "Invalid Creadential"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message: "Login Successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

/**LOGOUT */

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split("")[0]

    if (!token) {
        return res.status(400).json({
            message: "Token not Found"
        })
    }

    await blackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User Logout Successfully"
    })

}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}