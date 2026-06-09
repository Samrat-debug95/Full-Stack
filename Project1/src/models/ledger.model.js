const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: true,
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: true,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT", "CREDIT"],
            message:"Type must be D C"
        },
        required:true,
        immutable:true
    }
})


function preventLedgerModify() {
    throw new Error("Ledger entries are Immutable, cannot be modify or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModify)
ledgerSchema.pre('updateOne', preventLedgerModify)
ledgerSchema.pre('deletaOne', preventLedgerModify)
ledgerSchema.pre('remove', preventLedgerModify)
ledgerSchema.pre('deleteMany', preventLedgerModify)
ledgerSchema.pre('updateMany', preventLedgerModify)
ledgerSchema.pre('findOneAndDelete', preventLedgerModify)
ledgerSchema.pre('findOneAndReplace', preventLedgerModify)


const ledgerModel = mongoose.model("ledger", ledgerSchema)


module.exports = ledgerModel