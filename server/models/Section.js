const mongoose= require('mongoose');

exports.sectionSchema=new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,  
        trim:true
    },
    subSections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Subsection'
        }
    ]
});

module.exports=mongoose.model('Section',exports.sectionSchema);