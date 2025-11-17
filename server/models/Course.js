const mongoose=require('mongoose');

exports.courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
        trim:true
    },  
    courseDescription:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    whatYouWillLearn:{
        type:String
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Section',
            required:true
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,    
            ref:'RatingAndReview'
        }
    ],
    thumbnailImageURL:{
        type:String,
        required:true,
        trim:true
    },
    tag:{
        type:String,
        ref:'Tag',
        required:true,
        trim:true
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ]

});

exports.module=new mongoose.model('Course',exports.courseSchema);