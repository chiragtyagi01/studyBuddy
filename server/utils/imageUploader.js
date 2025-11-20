const cloudinary = require('cloudinary');

exports.uploadImageToCloudinary = async (file, folder, height, quality)=>{
    console.log("Uploading file from path:", file.tempFilePath); 
    console.log("File MIME Type:", file.mimetype);
    const options= {folder};
    if (height) {
        options.height =height;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type ="video";

    return await cloudinary.uploader.upload(file.tempFilePath, options);

};