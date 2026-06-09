const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please Emter Your Email"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address"],
        unque: [true, "Email Already Exist"]
    },
    name: {
        type: String,
        required: [true, "Please Enter your Name"],
    },
    password: {
        type: String,
        required: [true, "Enter Password"],
        minlength: [6, "password is too short"],
        select: false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:this.translateAliases,
        select:false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        return next()
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel