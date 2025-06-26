const express = require("express");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const {
  loginAdminController,
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
  getAnalyticsController,
  getAnnouncementsController,
  postAnnouncementController,
  getSettingsController,
  postSettingsController,
  deleteAnnouncementController,
  editCourseController,
} = require("../controllers/adminController");

const router = express.Router();

// Admin login (no auth required)
router.post("/login", loginAdminController);

router.get("/getallusers", adminAuthMiddleware, getAllUsersController);

router.get("/getallcourses", adminAuthMiddleware, getAllCoursesController);

router.delete('/deletecourse/:courseid', adminAuthMiddleware, deleteCourseController)

router.patch('/editcourse/:courseId', adminAuthMiddleware, editCourseController)

router.delete('/deleteuser/:userid', adminAuthMiddleware, deleteUserController)

// Analytics
router.get('/analytics', adminAuthMiddleware, getAnalyticsController);

// Announcements
router.get('/announcements', getAnnouncementsController);
router.post('/announcements', adminAuthMiddleware, postAnnouncementController);
router.delete('/announcements/:id', adminAuthMiddleware, deleteAnnouncementController);

// Settings
router.get('/settings', adminAuthMiddleware, getSettingsController);
router.post('/settings', adminAuthMiddleware, postSettingsController);

module.exports = router;
