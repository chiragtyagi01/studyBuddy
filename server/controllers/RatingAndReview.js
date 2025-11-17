const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');


// create rating
exports.createRating = async (req, res) =>{
    try {
        //get userId
        const userId = req.user.id;
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDeatils = await Course.findOne({
            _id:courseId,
            studentsEnrolled:{
                $elemMatch:{
                    $eq: userId
                }
            }
        });
        //validation
        if (!courseDeatils) {
             return res.status(400).json({
                success:false,
                message:'Student is not erolled in the course'
            })
        }
        // check if user is already reviewed or not
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course:courseId,
        });
        if (alreadyReviewed) {
             return res.status(400).json({
                success:false,
                message:'Course is already reviewed by the user',
            });
        }
        //create new rating and review
        const ratingAndReviews = await RatingAndReview.create({
            rating, review, course:courseId, user:userId,
        });
        // update course with rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews:ratingAndReviews._id,
            }
        },{new: true})

        console.log(updatedCourseDetails);
        
        //return response
         return res.status(200).json({
                success:true,
                message:'Rating and review created Successfully',
                ratingAndReviews
            })
    } catch (error) {
        console.log(error);
         return res.status(500).json({
                success:false,
                message:error.message,
            })
    }
};
// get average rating
exports.getAverageRating = async (req, res) => {
    try {
        // get courseID
        const courseId = req.body.courseId;
        // calculate the avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating:{
                        $avg: "$rating"
                    },
                }
            }
        ])
        // return rating
        if (result.length>0) {
             return res.status(200).json({
                success:true,
                message:'average rating calculated',
                averageRating:result[0].averageRating,
            })
        } 

        // if no rating/review exist 
         return res.status(200).json({
                success:true,
                message:'Average rating is 0 , no rating given till now',
                averageRating:0,
            })
    } catch (error) {
        console.log(error)
         return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}

// get all rating

exports.getAllRating = async (req, res) =>{
    try {
        // fetch data
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:'user',
            select:'firstName lastName email image',
        }).populate({
            path:"course",
            select:"courseName"
        }).exec();
        //return response
         return res.status(200).json({
                success:true,
                message:'All reviews fetched successfully',
                data:allReviews,
            })
    } catch (error) {
         console.log(error)
         return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
