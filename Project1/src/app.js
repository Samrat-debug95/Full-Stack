const express = require('express')
const cookie = require('cookie-parser')

const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")



const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(cookie())

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transaction", transactionRoutes)



module.exports = app