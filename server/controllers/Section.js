const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require('../models/Subsection'); //check this line


exports.createSection = async(req,res) =>{
    try {
        //data fetch
        const {sectionName, courseId} =req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'All fields are required and missing properties',
                error:error.message
            })
        }
        //create section
        const newSection= await Section.create({sectionName});
        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {
                new:true
            },
        )
        // populate all sections under course
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSection', // populate subsections inside each section
            },
        })
        .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created Successfully',
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error in creating Section, Please try again',
            error:error.message
        })
    }
};

//update section

exports.updateSection = async (req, res) =>{
    try {
        //fetch Data
        const {sectionName, sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success:false,
                message:'Missing Properties',
                error:error.message
            })
        }
        //update data
        const section= await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        //return response
        return res.status(200).josn({
            success:true,
            message:'Section updated Successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to update the section, Please try agian',
            error:error.message,
        })
    }
};

//delete section

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })
    const section = await Section.findById(sectionId)
    console.log(sectionId, courseId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}