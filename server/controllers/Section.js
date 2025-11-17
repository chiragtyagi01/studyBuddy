const Section = require('../models/Section');
const Course = require('../models/Course');
const { updateMany } = require('../models/User');

exports.createSection = async(req,res) =>{
    try {
        //data fetch
        const {sectionName, courseId} =req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'All fields are required and missing properties',
                error:error.message
            })
        }
        //create section
        const newSection= await Section.create({sectionName});
        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {
                new:true
            },
        )
        // populate all sections under course
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSection', // populate subsections inside each section
            },
        })
        .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created Successfully',
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error in creating Section, Please try again',
            error:error.message
        })
    }
};

//update section

exports.updateSection = async (req, res) =>{
    try {
        //fetch Data
        const {sectionName, sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success:false,
                message:'Missing Properties',
                error:error.message
            })
        }
        //update data
        const section= await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        //return response
        return res.status(200).josn({
            success:true,
            message:'Section updated Successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to update the section, Please try agian',
            error:error.message,
        })
    }
};

//delete section

exports.deleteSection = async(req, res)=>{
    try {
        //get id - assuming sending the section id in pramaters
        const {sectionId} =req.params
        //use findbyid and delete the section
        await Section.findByIdAndDelete({sectionId});  
        // return response
        return res.status(500).josn({
            success:true,
            message:'Section deleted Successfully',
        })
    } catch (error) {
        return res.status(500).josn({
            success:false,
            message:'Unable to delete section',
            error:error.message
        })
    }
}