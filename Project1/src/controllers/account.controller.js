const accountModel = require('../models/account.model')

const createAccountController = async (req, res) => {
    const user = req.user

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}

async function fetchUserAccount(req, res) {
    const accounts = await accountModel.findOne({ user: req.user._id })

    res.status(200).json({
        accounts
    })
}


async function getAccBalancs(req, res) {
    const {accId} = req.params
    
    const account = await accountModel.findOne({
        _id:accId,
        user:req.user._id
    })

    if (!account) {
        return res.status(404).json({
             message:"Account Not Found"
        })
    }

    const balance = await account.getBalance()

    res.status(200).json({
        accId:account._id,
        balance:balance
    })
}

module.exports = {
    createAccountController,
    fetchUserAccount,
    getAccBalancs
}