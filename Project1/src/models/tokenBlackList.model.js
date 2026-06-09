const mongoose = require('mongoose')

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required"],
        unique: [true, "user already blacklisted"]
    }
}, { timeseries: true })

blackListSchema.index(
    { createAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 3 }
)

const blackListModel = mongoose.model("tokenBalcklist", blackListSchema)

module.exports = blackListModel