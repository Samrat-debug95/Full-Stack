const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")


/**
 * - create a new transaction
 * the 10 steps tranfer flow
    * 1. Validate Request
    * 2. Validate idempotency Key
    * 3. check account status
    * 4. Derive sender balance from ledger
    * 5. Create Transacyion (Pending)
    * 6. Create Debit Ledger Entry
    * 7. Create Credit Ledger Entry
    * 8. Marks Transaction Completed
    * 9. Commit mongoDB session
    * 10. send Email Notification
 */

async function createTransaction(req, res) {

    /** 1. Validate Request */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount) {
        return res.status(400).json({
            message: "fromAcc, toAcc, amount are required"
        })
    }
    const fromUserAcc = await accountModel.findOne({ _id: fromAccount })
    const toUserAcc = await accountModel.findOne({ _id: toAccount })

    if (!fromUserAcc || !toUserAcc) {
        return res.status(400).json({
            message: "User account not exist"
        })
    }

    /** 2. Validate Idempotency Key */
    const transactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (transactionAlreadyExist) {
        if (transactionAlreadyExist.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction Completed",
                transaction: transactionAlreadyExist
            })
        }
        if (transactionAlreadyExist.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction Pending",
                transaction: transactionAlreadyExist
            })
        }
        if (transactionAlreadyExist.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction Failed",
                transaction: transactionAlreadyExist
            })
        }
        if (transactionAlreadyExist.status === "REVERSED") {
            return res.status(200).json({
                message: "Transaction Reversed",
                transaction: transactionAlreadyExist
            })
        }
    }

    /** 3. Check Account Status */

    if (fromUserAcc.status != "ACTIVE" || toUserAcc.status != "ACTIVE") {
        return res.status(400).json({
            message: "User account status must be Active"
        })
    }

    /** 4. Derive sender balance from ledger */

    const balance = await fromUserAcc.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient Balance. Current balance ${balance}, Request Amount is ${amount}`
        })
    }

    let transaction;

    try {


        /** 
        * 5. Create Transacyion (Pending)
        * 6. Create Debit Ledger Entry
        * 7. Create Credit Ledger Entry
        * 8. Marks Transaction Completed 
        * 9. Commit mongoDB session
        */
        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 20 * 1000))
        })()

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        transaction = await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            {
                new: true,
                session
            }
        )

        await session.commitTransaction()
        session.endSession()

    } catch (error) {
        return res.status(400).json({
            message: "Transaction is Pending, Please wait a minute"
        })
    }
    /** 10.  send Email Notification*/

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(200).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })

}


async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "This all fields are required"
        })
    }

    const toUserAcc = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAcc) {
        return res.status(400).json({
            message: "Invalid Account"
        })
    }

    const fromUserAcc = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAcc) {
        res.status(400).json({
            message: "SystemUser Account not founds"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAcc._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })


    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAcc._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toUserAcc._id,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
        message: "initial Funds Transaction completed successfully",
        transaction: transaction
    })

}



module.exports = {
    createTransaction,
    createInitialFundsTransaction
}