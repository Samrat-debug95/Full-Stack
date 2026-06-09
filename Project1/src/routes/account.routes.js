const express = require('express')
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")


const router = express.Router()

router.post("/create", authMiddleware.authMiddleware, accountController.createAccountController)

router.get("/get/account", authMiddleware.authMiddleware, accountController.fetchUserAccount)

router.get("/get/amount/:accId", authMiddleware.authMiddleware, accountController.getAccBalancs)

module.exports = router