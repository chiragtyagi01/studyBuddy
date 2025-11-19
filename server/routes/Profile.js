const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount);
// Update profile
router.put("/updateProfile", auth, updateProfile);
// Get user details
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// Update display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// Get instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router
