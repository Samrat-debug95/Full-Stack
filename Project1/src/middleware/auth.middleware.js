const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken')
const blackListModel = require("../models/tokenBlackList.model")

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split("")[1]

    if (!token) {
        return res.status(401).json({
            message: "Token is required"
        })
    }

    const isBlackListed = await blackListModel.findOne({
        token: token
    })

    if (isBlackListed) {
        return res.status(401).json({
            message: "Token is BlackListed"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId)
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid"
        })
    }
}

const systemUserMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split("")[1]

    if (!token) {
        return res.status(401).json({
            message: "Token is required"
        })
    }

    const isBlackListed = await blackListModel.findOne({
        token: token
    })

    if (isBlackListed) {
        return res.status(401).json({
            message: "Token is Invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "You are mot a System User"
            })
        }
        req.user = user
        return next()
    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid"
        })
    }
}

module.exports = {
    authMiddleware,
    systemUserMiddleware
}