const { response } = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');


//update profile
exports.updateProfile = async (req, res) =>{
    try {
        // fetch data
        const {dateOfBirth="",about="",contactNumber,gender} =req.body;
        // get userid
        const id=req.user.id;
        // validate data
        if(!contactNumber || !gender || !id){
            return res.status(404).json({
                success:false,
                message:'All fields are required',
            })
        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        //save to DB
        await profileDetails.save();
        // return response
        return res.status(200).json({
                success:true,
                message:'Profile updated Successfully',
                profileDetails,
            });
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to update Profile',
                error:error.message
            });
    }
};

//delete Account

//update Subsection
exports.updateSubsection=async(req,res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to update Subsection',
                error:error.message
            });
    }
};
//delete Subsection
exports.deleteAccount=async(req,res)=>{
    try {
        // get id
        const id = req.user.id;
        // validate id
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found',
                error:error.message
            });
        }
        // delete user profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete user
        await User.findByIdAndDelete({_id:id});
        // return response
        return res.status(200).json({
                success:true,
                message:'User deleted Successfully',
                
            });
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to delete User',
                error:error.message
            });
    }
};

//update Subsection
exports.updateSubsection=async(req,res)=>{
    try {
        
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to update Subsection',
                error:error.message
            });
    }
};

//get user details
exports.deleteSubsection=async(req,res)=>{
    try {
        // get id
        const id = req.user.id;
        // get user details
        const userDetails =await User.findById(id).populate("additionalDetails").exec();
        // validation
        if(!id || !userDetails){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
                error:error.message
            });
        }
        // return response
        return res.status(200).json({
                success:true,
                message:'User data fetched Successfully',
            });
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to fetch user Details',
                error:error.message
            });
    }
};