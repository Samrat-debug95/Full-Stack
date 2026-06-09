const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "From Account is required for Create Traansaction"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true, "To Account is required for Create Traansaction"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message:"Status can be P C F R"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true, "Amount is required for creating Transaction"],
        min:[0, "Amount can't be Negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotencyKey is required"],
        index:true,
        unique:true
    }
    
},{
    timestamps:true
})


const transactionModel = mongoose.model("transaction", transactionSchema)

module.exports = transactionModel