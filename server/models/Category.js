const mongoose =require('mongoose');

exports.categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:true
    }
});

module.exports=mongoose.model('Category',exports.categorySchema);