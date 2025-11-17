const { json } = require('express');
const Course = require('../models/Course');
const Tag = require('../models/Category');
const User = require('../models/User');
const uploadImageToCloudinary = require('../utils/imageUploader');

//createCourse handler function
exports.createCourse = async (req, res) =>{
    try {
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn ,price, tag} = req.body;

        //get thumbnail
        const thumbnail =req.files.thumbnailImage;

        //vaildation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag) {
            return res.status(400).json({
                success:false,
                message:'All Fields are required',
            });
        }
        //check for instructor
        //check ***********************
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log('instructor details',instructorDetails);
        
        if (!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor details not found',
            });
        }
        
        //check given tag is valid or not 
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
                success:false,
                message:'Tag details not found',
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );
        
        //check the tag code
        //*********** */
        //update the tag schema
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    tag:tag._id,
                }
            },
            {new:true},
        );
        //******************* */

        //return response
        return res.status(200).json({
            success:true,
            message:'Course Created Successfully',
            data:newCourse,
        });
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:'error in createCourse handler function Failed to create courses',
            error:error.message

        })
    }
}

//getAllCourses handler funcion
exports.getAllCourses = async(req, res)=>{
    try {
        const allCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate('instructor').exec();

        return res.status(200).json({
            success:true,
            message:'Data for all cources fetched successfully',
            error:error.message,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Cannot fetch course data',
            error:error.message
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async (req,res) =>{
    try {
        // fetch courseid
        const {courseId}= req.body;
        // find course details
        const courseDetails = await Course.findById({_id:courseId}).populate(
            {
                path:'instructor',
                populate:{
                    path:'additionalDetails'
                },
            }
        ).populate('category').populate('ratingAndreviews').populate({
            path:'courseContent',
            populate:{
                path:'subSection',
            }
        }).exec();

        // validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }
        // return response
        return res.status(200).json({
            success:true,
            message:'Course Details fetched successfully',
            data:courseDetails,
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
                success:false,
                message:error.message
            });
    }
};
