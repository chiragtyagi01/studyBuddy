const cloudinary = require("cloudinary").v2;

exports.uploadVideoToCloudinary = async (file, folder) => {
    console.log("Uploading VIDEO file:", file.tempFilePath);
    console.log("MIME TYPE:", file.mimetype);
    console.log("Cloudinary options:", {
    folder,
    resource_type: "video"
});


    return await cloudinary.uploader.upload(file.tempFilePath, {
        folder: folder,
        resource_type: "video",   // REQUIRED
        chunk_size: 6000000,      // fixes big videos
    });
};
