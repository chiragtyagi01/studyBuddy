const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const express = require('express');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const otpTemplate =require('../mail/templates/emailVerificationTemplate')
require('dotenv').config();

//send otp
exports.sendotp = async (req, res) => {
    const { email } = req.body;

    try {
        // fetch email
        const checkUser = await User.findOne({ email });
        // validation
        if (checkUser) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            });
        }

        // generate unique OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        let existingOTP = await OTP.findOne({ otp });
        while (existingOTP) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });
            existingOTP = await OTP.findOne({ otp });
        }

        await OTP.create({ email, otp });

        // send email
        await mailSender(
            email,
            "Your Verification OTP",
            otpTemplate
        );

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error sending OTP',
            error: error.message
        });
    }
};


//signup
exports.signup = async (req, res) => {
    // fetch details
    const { firstname, lastname, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;
    try {
        // validation
        if (!firstname || !lastname || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }
        // check if user already exist or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: 'User already exists'
            });
        }
        // find latest otp
        const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        if (!recentOTP) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            });
        }
        //compare otp
        if (recentOTP.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newProfile = await Profile.create({
            gender: null,
            dateofbirth: null,
            about: null,
            contactNumber
        });
        // create new user
        const newUser = await User.create({
            firstName: firstname,
            lastName: lastname,
            email,
            password: hashedPassword,
            accountType: accountType || 'Student',
            additionalDetails: newProfile._id,
            image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstname} ${lastname}`
        });
        // return response
        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in user registration',
            error: error.message
        });
    }
};


//login
exports.login = async (req, res) => {
    // fetch details 
    const { email, password } = req.body;

    try {
        // validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }
        // check if user exist or not
        const existingUser = await User.findOne({ email }).populate("additionalDetails");
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }
        // compare password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const payload = {
            userId: existingUser._id,
            email: existingUser.email,
            accountType: existingUser.accountType
        };
        // create token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        // pass token to user
        existingUser.token = token;
        existingUser.password = undefined; //hide password
        // create cookie
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        });
        // return response
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: existingUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
};


//change password
exports.changePassword = async (req, res) => {
    // fetch data from body
    const { email, oldPassword, newPassword } = req.body;

    try {
        // data validation
        if (!email || !oldPassword || !newPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }
        // check user exist or not
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "User does not exist"
            });
        }
        // compare password
        const isValid = await bcrypt.compare(oldPassword, existingUser.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect"
            });
        }
        // encrypt new password
        existingUser.password = await bcrypt.hash(newPassword, 10);
        await existingUser.save();
        // send mail 
        await mailSender(
            email,
            "Password Changed",
            "Your password has been successfully updated."
        );
        // return response
        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error changing password",
            error: error.message
        });
    }
};

