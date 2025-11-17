const mongoose = require('mongoose');

exports.ProfileSchema = new mongoose.Schema({
    gender:{
        type:String,
        enum:['Male','Female','Other'],
        required:true
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    about:{
        type:String,
        required:false,
        trim:true
    },
    contactNumber:{
        type:String,
        required:true,
        trim:true
    }, 
});

module.exports = mongoose.model('Profile',exports.ProfileSchema);