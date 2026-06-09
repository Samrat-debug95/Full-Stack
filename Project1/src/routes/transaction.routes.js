const {Router} = require('express')
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router()

transactionRoutes.post("/transaction", authMiddleware.authMiddleware, transactionController.createTransaction)

transactionRoutes.post("/system/initial-funds", authMiddleware.systemUserMiddleware, transactionController.createInitialFundsTransaction)

module.exports = transactionRoutes


