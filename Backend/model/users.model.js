const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: { type: String, enum: ['buyer', 'seller',"admin"] },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    otp: String,
    otpExpires: Date
});

const UserModel= mongoose.model('User', userSchema);
module.exports ={UserModel}
