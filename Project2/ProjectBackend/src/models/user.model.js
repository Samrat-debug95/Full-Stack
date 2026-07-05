const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [ true, 'Username is required'],
            unique: [   true, 'Username already exists'],
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [ true, 'Email is required'],
            unique: [   true, 'Email already exists'],
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [ true, 'Password is required'],
            minlength: [ 6, 'Password must be at least 6 characters long'], 
        },
        fullname: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
)

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
