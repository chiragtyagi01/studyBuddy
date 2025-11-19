const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

// resetPassword token
exports.resetPasswordToken = async (req, res) => {
    // extract email from request body
    const email = req.body.email;
    try {
        // check if user exists
        const existingUser = await User.findOne({ email:email });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist.'
            });
        }
        //generate token
        const token = crypto.randomUUID();
        // const token = crypto.randomBytes(20).toString("hex")
        //set token and expiry on user model
        const updateDetails = await User.findByIdAndUpdate(existingUser._id, 
        {
            token: token,
            resetPasswordExpires: Date.now() + 10*60*1000 // 10 minutes from now
        }, { new: true });
        //create reset password url
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        try {
            //send email
            const mailResponse = await mailSender(
                email,
                "Reset your password",
                `Click the link to reset your password: ${resetPasswordUrl}. This link is valid for 10 minutes.`
            );
            return res.status(200).json({
                success: true,
                message: 'Reset password link sent to your email',
                mailResponse: mailResponse
            });
             
            
        } catch (error) {
            //handle email sending error
            console.log("Error in sending reset password email", error);
            return res.status(500).json({
                success: false,
                message: 'Error in sending reset password email',
                error: error.message
            });
        }

        
    } catch (error) {
        //handle error
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Error in resetPasswordToken controller',
            error: error.message
        });
    }
};

// request reset password

exports.resetPassword = async (req, res) => {
    // extract token and new password from request body
    const { token, password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({
            success: false,
            message: 'Password and confirm password do not match'
        });
    }
    try {
        // find user by token and check if token is not expired
        const user = await User.findOne({
            token: token,
            resetPasswordExpires: { $gt: Date.now() } // token expiry should be greater than current time
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        //hash password
        const hashedNewPassword = await bcrypt.hash(password,10);
        
        // update user's password and clear reset token fields
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedNewPassword},
            {new:true}
        );
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        //handle error
        return res.status(500).json({
            success: false,
            message: 'Error in updating the Password',
            error: error.message
        });
    }
};