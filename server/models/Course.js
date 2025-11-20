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
            // required:true
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
        // required:true,
        trim:true
    },
    tag:{
        type:[String],
        trim:true
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    ],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    },
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:['Draft','Published'],
        default:'Draft'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

});

module.exports=mongoose.model('Course',exports.courseSchema);