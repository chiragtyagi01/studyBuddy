const mongoose = require('mongoose');

// Create the schema FIRST
const subSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    timeDuration: {
        type: String,
        required: true,
        trim: true
    },
    videoURL: {
        type: String,
        required: true,
        trim: true
    }
});

// Export the model safely
module.exports = mongoose.model('Subsection', subSectionSchema);
