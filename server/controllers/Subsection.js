const SubSection =require('../models/Subsection');
const Section = require('../models/Section');
const { uploadVideoToCloudinary } = require('../utils/videoUploader');
require('dotenv').config();

//create Subsection
exports.createSubSection = async(req, res) =>{
    try {
        //fetch data
        const {sectionId, title, timeDuration, description}=req.body;
        //extract file
        console.log('files recevied',req.files);
        const video= req.files.videoFile;

          // DEBUG HERE ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        const fs = require("fs");
        console.log("TEMP FILE PATH:", video.tempFilePath);
        console.log("EXISTS:", fs.existsSync(video.tempFilePath));
        console.log("SIZE:", fs.statSync(video.tempFilePath).size);
        // DEBUG END ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

        //validate data
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }
        //upload to cloudinary
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
        //create Subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update Section with this sub section Object id
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSections:subSectionDetails._id,
                }
            },
            {
                new:true,
            }
        ).populate('subSections');
        //return response
        return res.status(200).json({
            success:true,
            message:'Subsection Created Successfully',
            updatedSection,
        })
    } catch (error) {
        console.log("CLOUDINARY ERROR:", error);
        return res.status(500).json({
        success:false,
        message:'Unable to create Subsection',
        error: error.message,
        cloudinary_error: error
        })
    }
};

//update Subsection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}
//delete Subsection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
};