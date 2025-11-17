const e = require('express');
const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

exports.OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:300 // OTP expires in 5 minutes
    }
});

//send email for otp

async function sendOTPEmail(email, otp){
    // Implementation for sending email
    try {
        const mailResonse = await mailSender(email, "Your OTP for verification", `Your OTP is ${otp}. It is valid for 5 minutes.`);
        console.log("Mail response: ", mailResonse);
    } catch (error) {
        console.log("error occured while sending email for otp",error);        
    }
}

exports.OTPSchema.pre('save', async function(next){
        await sendOTPEmail(this.email, this.otp);
    
    next();
});

module.exports = mongoose.model('OTP', exports.OTPSchema);