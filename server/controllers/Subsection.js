const SubSection =require('../models/Subsection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

//create Subsection
exports.createSubSection = async(req, res) =>{
    try {
        //fetch data
        const {sectionId, title, timeDuration, description}=req.body;
        //extract file
        const video= req.files?.videoFile;
        //validate data
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
                error:error.message
            })
        }
        //upload to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create Subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update Section with this sub section Object id
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:subSectionDetails._id,
                }
            },
            {
                new:true,
            }
        ).populate('subSection');
        //return response
        return res.status(200).json({
            success:true,
            message:'Subsection Created Successfully',
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to create Subsection',
            error:error.message
        })
    }
};

//update Subsection
exports.updateSubSection=async(req,res)=>{
    try {
        //fetch data
        const {subSectionId, title,description,timeDuration}=req.body;
        //validate required data
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:'Subsection ID required',
            });
        }
        //find existing subsection
        const existingSubSection=await SubSection.findById(subSectionId);
        if (!existingSubSection) {
            return res.status(404).json({
                success:false,
                message:'Subsection not found',
                error:error.message
            });
        }
        // If video file is uploaded, update the Cloudinary video
        if (req.files && req.files.videoFile) {
            const video = req.files.videoFile;
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            existingSubSection.videoUrl = uploadDetails.secure_url;
        }

        // Update fields
        if (title) existingSubSection.title = title;
        if (description) existingSubSection.description = description;
        if (timeDuration) existingSubSection.timeDuration = timeDuration;

        // Save changes
        await existingSubSection.save();
        //return response
        return res.status(200).json({
                success:true,
                message:'Subsection updated successfully',
                existingSubSection
            });
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to update Subsection',
                error:error.message
            });
    }
};
//delete Subsection
exports.deleteSubSection=async(req,res)=>{
    try {
        //fetch data
        const {subSectionId, sectionId}=req.body;
        //validate data
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Subsection ID and Section ID are required',
                error:error.message
            });
        }
        // Remove the subsection reference from the section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { subSection: subSectionId } },
            { new: true }
        ).populate('subSection');

        // Delete the subsection document itself
        await SubSection.findByIdAndDelete(subSectionId);
        //return response
        return res.status(200).json({
            success: true,
            message: 'Subsection deleted successfully',
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
                success:false,
                message:'Unable to delete Subsection',
                error:error.message
            });
    }
};