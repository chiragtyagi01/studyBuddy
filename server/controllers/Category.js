const { json } = require('express');
const Category = require('../models/Category');
const { courseSchema } = require('../models/Course');

//create category handler function

exports.createCategory =async (req,res) => {
    try {
        //fetch data from body
        const {name, description} = req.body;
        //data validation
        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:'All fields are required'
            })
        }
        //create entry in DB
        const categoryDetails= await Category.create({
            name:name,
            description:description
        });
        console.log(categoryDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:'Category created successfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in category handler middleware',
            error:error.message
        })
    }
}

//getAllcategory handler function
exports.showAllCategories = async (req, res) =>{
    try {
        //find all category form DB
        const allcategories = await Category.find({},{name:true ,description:true});
        //return response
        res.status(200).json({
            success:true,
            message:'All categories returned successfully',
            allcategories,
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// categoryPageDetails
exports.categoryPageDetails = async (req, res) =>{
    try {
        // get category id
        const {categoryId} = req.body;
        // get courses for specified category id
        const selectedCategory = await Category.findById(categoryId)
        .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
        })
        .exec();

        // validation
        console.log("SELECTED COURSE", selectedCategory)
        // Handle the case when the category is not found
        if (!selectedCategory) {
        console.log("Category not found.")
        return res.status(404).json({
            success: false, 
            message: "Category not found" 
        });
    }
        // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      })
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
