const {instance} =require('../config/razorpay');
const Course =require('../models/Course');
const User =require('../models/User');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const {paymentSuccessEmail} = require('../mail/templates/paymentSuccessEmail');
const { default: mongoose } = require('mongoose');
const courseProgress = require('../models/CourseProgress')

require('dotenv').config();

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) =>{
    try {
        // get courseID and UserID
        const {course_id} =req.body;
        const userId = req.user.id;
        // validation
        if(!course_id){
            return res.status(400).json({
                success:false,
                message:'Please provide valid courseId',
            })
        };
        // valid courseDeatil
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course){
            return res.status(400).json({
                success:false,
                message:'Could not find the course',
            })
        };
        // check user already paid for this course or not
        const uid =new mongoose.Types.ObjectId(userId); 
        if (course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success:false,
                message:'Student is already enrolled'
            })
        }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
        // order create
        const amount =course.price;
        const currency ="INR";

        const options ={
            amount: amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,
            }
        }
        try {
            // initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            
            // return response
            return res.status(200).json({
                success:true,
                message:'Order created successfully',
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            })
            
        } catch (error) {
            console.log(error);
            return res.json({
                success:false,
                message:'Could not initiate order'
            })
            
        }
    } catch (error) {
         return res.status(500).json({
                success:false,
                message:error.message,
            })   
    }
};


// verify the signature of razorpay and server
exports.verifySignature = async (req, res)=>{
    const webhookSecret =process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const shasum = crypto.createHmac('sha256',webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature == digest) {
        console.log('Payment is verified');
        const {courseId, userId}=req.body.payload.payment.entity.notes;
        try {
            // complete the action

            // find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {
                    $push:{
                        studentsEnrolled: userId
                    }
                },
                {new:true},
            );
            
            if (!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:'Course not found'
                });
            }

            console.log(enrolledCourse);

            // find the student and add the course to their list enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {
                    $push:{
                        courses:courseId
                    }
                },
                {new:true},
            );
            console.log(enrolledStudent);

            //mail send for confirmation 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "thanks for purchasing the course",
                "Congrats, you are onboard in to new course"
            );
            console.log(emailResponse);

            // return response
            return res.status(200).json({
                success:true,
                message:'Signature Verified and course Added'
            });
            
            
            
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:error.message
            });
        }
    }else{
        return res.status(400).json({
            success:false,
            message:'Invalid Request'
        })
    }   
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}