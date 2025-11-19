const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token from headers
        const token =req.cookies.token || req.body.token || req.headers.authorization.split(" ")[1];
        // const token = req.headers.authorization.replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        
        try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        //attach user to request object
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    next();  

    } catch (error) {
        //handle error
        return res.status(500).json({
            success: false,
            message: 'Error in auth middleware',
            error: error.message
        });
    }
};

//isStudent
exports.isStudent = async(req, res, next) => {
    try {
        const userDetails = await User.findOne({email: req.user.email});
        console.log(userDetails);
        if(userDetails.accountType !== 'Student'){
            return res.status(401).json({
                success: false,
                message: 'Access denied.This is a Protected Route for Students only'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in isStudent middleware',
            error: error.message
        });
    }
};

//isInstructor
exports.isInstructor = async(req, res, next) => {
    try {
        const userDetails = await User.findOne({email: req.user.email});
        console.log(userDetails);
        if(userDetails.accountType !== 'Instructor'){
            return res.status(403).json({
                success: false,
                message: 'Access denied. This is a Protected Route for Instructors only'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: 'Error in isInstructor middleware',
            error: error.message
        });
    }
};


//isAdmin
exports.isAdmin = async(req, res, next) => {
    try {
        const userDetails = await User.findOne({email: req.user.email});
        console.log(userDetails);
        if(userDetails.accountType !== 'Admin'){
            return res.status(403).json({
                success: false,
                message: 'Access denied.This is a Protected Route for Admins only'
            }); 
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in isAdmin middleware',
            error: error.message
        });
    }
};