const e = require('express');
const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

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
        const mailResonse = await mailSender(
            email,
            "Your OTP for verification",
            emailTemplate(otp)
         );
        console.log("Mail response: ", mailResonse);
    } catch (error) {
        console.log("Error occured while sending email for otp",error);        
    }
}
// Define a post-save hook to send email after the document has been saved
exports.OTPSchema.pre('save', async function(next){
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendOTPEmail(this.email, this.otp);
	}
	next();
});

module.exports = mongoose.model('OTP', exports.OTPSchema);