const mongoose =require('mongoose');

exports.subSectionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    timeDuration:{
        type:String,
        required:true,  
        trim:true
    },
    videoURL:{
        type:String,
        required:true,
        trim:true
    } 
});

module.exports=mongoose.model('SubSection',exports.subSectionSchema);