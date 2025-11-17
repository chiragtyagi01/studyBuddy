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
        const allcategory = await Category.find({},{name:true ,description:true});
        //return response
        res.status(200).json({
            success:true,
            message:'All categories returned successfully',
            allcategory,
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
        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
        // validation
        if (!selectedCategory) {
            return res.status(400).json({
                success:false,
                message:'Data not found'
            });
        }
        //get courses for different category
        const differentCategories = await Category.find({
            _id:{
                $ne: categoryId
            }
        }).populate("courses").exec();

        // get top selling courses
        const topSellingCourses = await Course.find({}).sort({studentEnrolled: -1}).limit(10).populate("instructor").exec();
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
            },
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'Unable to get all categorypage details'
        })
    }
}