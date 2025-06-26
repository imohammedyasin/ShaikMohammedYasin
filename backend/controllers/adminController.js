const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");
const Admin = require('../schemas/adminModel');
const jwt = require('jsonwebtoken');
const Announcement = require('../schemas/announcementModel');
const Settings = require('../schemas/settingsModel');

const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find();
    if (allUsers == null || !allUsers) {
      return res.status(401).send({ message: "No users found" });
    }
    res.status(200).send({ success: true, data: allUsers });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (allCourses == null || !allCourses) {
      return res.status(401).send({ message: "No courses found" });
    }
    res.status(200).send({ success: true, data: allCourses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

const deleteCourseController = async (req, res) => {
  const { courseid } = req.params; // Use the correct parameter name
  try {
    // Attempt to delete the course by its ID
    const course = await courseSchema.findByIdAndDelete({ _id: courseid });

    // Check if the course was found and deleted successfully
    if (course) {
      res
        .status(200)
        .send({ success: true, message: "Course deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Course not found" });
    }
  } catch (error) {
    console.error("Error in deleting course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete course" });
  }
};

const deleteUserController = async (req, res) => {
  const { userid } = req.params; // Use the correct parameter name
  try {
    // Attempt to delete the user by its ID
    const user = await userSchema.findByIdAndDelete({ _id: userid });

    // Check if the user was found and deleted successfully
    if (user) {
      res
        .status(200)
        .send({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error in deleting user:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete user" });
  }
};

const loginAdminController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const admin = await Admin.findOne({ $or: [ { username }, { email } ] });
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_KEY, { expiresIn: '1d' });
    res.status(200).json({ success: true, token, admin: { username: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAnalyticsController = async (req, res) => {
  try {
    const totalUsers = await userSchema.countDocuments();
    const totalCourses = await courseSchema.countDocuments();
    const totalEnrollments = await enrolledCourseSchema.countDocuments();
    // For demo, active users = users with at least 1 enrollment
    const activeUsers = await enrolledCourseSchema.distinct('userId');
    res.status(200).json({ success: true, data: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      activeUsers: activeUsers.length
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAnnouncementsController = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const postAnnouncementController = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });
    const createdBy = req.body.adminId || 'admin';
    const announcement = await Announcement.create({ message, createdBy });
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSettingsController = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const postSettingsController = async (req, res) => {
  try {
    const { maintenanceMode, allowRegistrations } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    if (typeof maintenanceMode === 'boolean') settings.maintenanceMode = maintenanceMode;
    if (typeof allowRegistrations === 'boolean') settings.allowRegistrations = allowRegistrations;
    settings.updatedAt = new Date();
    await settings.save();
    console.log('Settings updated:', {
      maintenanceMode: settings.maintenanceMode,
      allowRegistrations: settings.allowRegistrations,
      updatedAt: settings.updatedAt
    });
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAnnouncementController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const editCourseController = async (req, res) => {
  const { courseId } = req.params;
  const { C_title, C_description, C_categories, C_price, thumbnail, previewVideo } = req.body;

  try {
    // Find the course
    const course = await courseSchema.findById(courseId);
    if (!course) {
      return res.status(404).send({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Update course fields
    const updateData = {};
    if (C_title) updateData.C_title = C_title;
    if (C_description) updateData.C_description = C_description;
    if (C_categories) updateData.C_categories = C_categories;
    if (C_price) updateData.C_price = C_price;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (previewVideo) updateData.previewVideo = previewVideo;

    // Update the course
    const updatedCourse = await courseSchema.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).send({ 
      success: false, 
      message: "Failed to update course" 
    });
  }
};

module.exports = {
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
};
