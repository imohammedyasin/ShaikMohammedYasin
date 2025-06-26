const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");
//////////for registering/////////////////////////////
const registerController = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userSchema({
      name,
      email,
      password: hashedPassword,
      type,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

////for the login
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

//get all courses
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find();
    if (!allCourses) {
      return res.status(404).send("No Courses Found");
    }

    return res.status(200).send({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.error("Error in deleting course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to delete course" });
  }
};

////////posting course////////////
const postCourseController = async (req, res) => {
  try {
    let price;
    // Extract data from the request body and files
    const {
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price,
      C_description,
      S_title,
      S_description,
    } = req.body;
    const S_content = req.files['S_content'] ? req.files['S_content'].map((file) => file.filename) : [];
    const thumbnailFile = req.files['thumbnail'] && req.files['thumbnail'][0] ? req.files['thumbnail'][0].filename : null;

    // Extra validation
    if (!userId || !C_educator || !C_title || !C_categories || !C_description) {
      return res.status(400).send({ success: false, message: "Missing required course fields." });
    }
    if (!S_title || !S_description || !S_content || S_content.length === 0) {
      return res.status(400).send({ success: false, message: "At least one section with title, description, and content is required." });
    }
    if (Array.isArray(S_title) && S_title.some((t) => !t) || Array.isArray(S_description) && Array.isArray(S_description) && S_description.some((d) => !d)) {
      return res.status(400).send({ success: false, message: "All sections must have a title and description." });
    }
    if (Array.isArray(S_content) && S_content.some((c) => !c)) {
      return res.status(400).send({ success: false, message: "All sections must have content." });
    }

    // Create an array of sections
    const sections = [];
    if (S_content.length > 1) {
      for (let i = 0; i < S_content.length; i++) {
        sections.push({
          S_title: S_title[i],
          S_content: `/uploads/${S_content[i]}`,
          S_description: S_description[i],
          S_type: 'video',
        });
      }
    } else {
      sections.push({
        S_title: S_title,
        S_content: `/uploads/${S_content[0]}`,
        S_description: S_description,
        S_type: 'video',
      });
    }
    
    if (C_price == 0) {
      price = "free";
    } else {
      price = C_price;
    }
    // Create an instance of the course schema
    const course = new courseSchema({
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price: price,
      C_description,
      sections,
      thumbnail: thumbnailFile ? `/uploads/${thumbnailFile}` : undefined,
    });
    // Save the course instance to the database
    await course.save();
    res
      .status(201)
      .send({ success: true, message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .send({ success: false, message: error.message || "Failed to create course" });
  }
};

///all courses for the teacher
const getAllCoursesUserController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find({ userId: req.body.userId });
    if (!allCourses) {
      res.send({
        success: false,
        message: "No Courses Found",
      });
    } else {
      res.send({
        success: true,
        message: "All Courses Fetched Successfully",
        data: allCourses,
      });
    }
  } catch (error) {
    console.error("Error in fetching courses:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch courses" });
  }
};

///delete courses by the teacher
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params; // Use the correct parameter name
  const userId = req.body.userId; // From auth middleware
  
  try {
    // Find the course first to check permissions
    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res.status(404).send({ success: false, message: "Course not found" });
    }

    // Check permissions: teacher can only delete their own courses, admin can delete all
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user is admin or the course owner
    const isAdmin = user.type === 'admin';
    const isCourseOwner = course.userId === userId;

    if (!isAdmin && !isCourseOwner) {
      return res.status(403).send({ 
        success: false, 
        message: "You don't have permission to delete this course" 
      });
    }

    // Delete the course
    await courseSchema.findByIdAndDelete({ _id: courseid });

    res.status(200).send({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error in deleting course:", error);
    res.status(500).send({ success: false, message: "Failed to delete course" });
  }
};

////enrolled course by the student

const enrolledCourseController = async (req, res) => {
  const { courseid } = req.params;
  const { userId } = req.body;
  try {
    const course = await courseSchema.findById(courseid);

    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course Not Found!" });
    }

    let course_Length = course.sections.length;

    // Check if the user is already enrolled in the course
    const enrolledCourse = await enrolledCourseSchema.findOne({
      courseId: courseid,
      userId: userId,
      course_Length: course_Length,
    });

    if (!enrolledCourse) {
      const enrolledCourseInstance = new enrolledCourseSchema({
        courseId: courseid,
        userId: userId,
        course_Length: course_Length,
      });

      const coursePayment = new coursePaymentSchema({
        userId: req.body.userId,
        courseId: courseid,
        ...req.body,
      });

      await coursePayment.save();
      await enrolledCourseInstance.save();

      // Increment the 'enrolled' count of the course by +1
      course.enrolled += 1;
      await course.save();

      res.status(200).send({
        success: true,
        message: "Enroll Successfully",
        course: { id: course._id, Title: course.C_title },
      });
    } else {
      res.status(200).send({
        success: false,
        message: "You are already enrolled in this Course!",
        course: { id: course._id, Title: course.C_title },
      });
    }
  } catch (error) {
    console.error("Error in enrolling course:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to enroll in the course" });
  }
};

/////sending the course content for learning to student
const sendCourseContentController = async (req, res) => {
  const { courseid } = req.params;

  try {
    const course = await courseSchema.findById({ _id: courseid });
    if (!course)
      return res.status(404).send({
        success: false,
        message: "No such course found",
      });

    // Use userId from req.body (set by authMiddleware for all requests)
    const userId = req.body.userId;
    if (!userId) {
      console.error('userId missing in sendCourseContentController');
      return res.status(401).send({
        success: false,
        message: "User not authenticated. userId missing."
      });
    }

    const user = await enrolledCourseSchema.findOne({
      userId: userId,
      courseId: courseid, // Add the condition to match the courseId
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found or not enrolled in this course",
      });
    } else {
      return res.status(200).send({
        success: true,
        courseContent: course.sections,
        completeModule: user.progress,
        certficateData: user,
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

//////////////completing module////////
const completeSectionController = async (req, res) => {
  const { courseId, sectionId } = req.body; // Assuming you send courseId and sectionId in the request body

  // console.log(courseId, sectionId)
  try {
    // Check if the user is enrolled in the course
    const enrolledCourseContent = await enrolledCourseSchema.findOne({
      courseId: courseId,
      userId: req.body.userId, // Assuming you have user information in req.user
    });

    if (!enrolledCourseContent) {
      return res
        .status(400)
        .send({ message: "User is not enrolled in the course" });
    }

    // Update the progress for the section
    const updatedProgress = enrolledCourseContent.progress || [];
    updatedProgress.push({ sectionId: sectionId });

    // Update the progress in the database
    await enrolledCourseSchema.findOneAndUpdate(
      { _id: enrolledCourseContent._id },
      { progress: updatedProgress },
      { new: true }
    );

    res.status(200).send({ message: "Section completed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

////////////get all courses for paricular user
const sendAllCoursesUserController = async (req, res) => {
  const { userId } = req.body;
  try {
    // First, fetch the enrolled courses for the user
    const enrolledCourses = await enrolledCourseSchema.find({ userId });

    // Now, let's retrieve course details for each enrolled course
    const coursesDetails = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => {
        // Find the corresponding course details using courseId
        const courseDetails = await courseSchema.findOne({
          _id: enrolledCourse.courseId,
        });
        return courseDetails;
      })
    );

    return res.status(200).send({
      success: true,
      data: coursesDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

///edit courses by teacher or admin
const editCourseController = async (req, res) => {
  const { courseId } = req.params;
  const { C_title, C_description, C_categories, C_price, thumbnail, previewVideo } = req.body;
  const userId = req.body.userId; // From auth middleware

  try {
    // Find the course
    const course = await courseSchema.findById(courseId);
    if (!course) {
      return res.status(404).send({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Check permissions: teacher can only edit their own courses, admin can edit all
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if user is admin or the course owner
    // For admin check, we need to verify if the user has admin role in JWT
    // Since this controller uses regular auth middleware, we'll check user type
    const isAdmin = user.type === 'admin';
    const isCourseOwner = course.userId === userId;

    if (!isAdmin && !isCourseOwner) {
      return res.status(403).send({ 
        success: false, 
        message: "You don't have permission to edit this course" 
      });
    }

    // Update course fields
    const updateData = {};
    if (C_title) updateData.C_title = C_title;
    if (C_description) updateData.C_description = C_description;
    if (C_categories) updateData.C_categories = C_categories;
    if (C_price !== undefined) updateData.C_price = C_price;
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

const getCourseAnalyticsController = async (req, res) => {
  const { courseId } = req.params;
  const teacherId = req.body.userId;

  try {
    const course = await courseSchema.findOne({ _id: courseId, userId: teacherId });
    if (!course) {
      return res.status(404).send({
        success: false,
        message: "Course not found or you don't have permission to view this course"
      });
    }

    const enrollments = await enrolledCourseSchema.find({ courseId }).populate('userId', 'name email');
    const totalEnrollments = enrollments.length;
    const totalSections = course.sections.length;
    const completionData = enrollments.map(enrollment => {
      const completedSections = enrollment.progress ? enrollment.progress.length : 0;
      const completionRate = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
      const isCompleted = completionRate === 100;
      return {
        studentId: enrollment.userId._id,
        studentName: enrollment.userId.name,
        studentEmail: enrollment.userId.email,
        completedSections,
        totalSections,
        completionRate: Math.round(completionRate * 100) / 100,
        isCompleted,
        enrolledDate: enrollment.createdAt,
        lastActivity: enrollment.updatedAt,
        certificateDate: enrollment.certificateDate
      };
    });
    const completedCourses = completionData.filter(data => data.isCompleted).length;
    const activeStudents = completionData.filter(data => data.completionRate > 0 && !data.isCompleted).length;
    const averageCompletionRate = totalEnrollments > 0 
      ? Math.round((completionData.reduce((sum, data) => sum + data.completionRate, 0) / totalEnrollments) * 100) / 100 
      : 0;
    const sectionAnalytics = course.sections.map((section, index) => {
      const studentsCompleted = completionData.filter(data => 
        data.completedSections > index
      ).length;
      return {
        sectionIndex: index,
        sectionTitle: section.S_title,
        studentsCompleted,
        completionRate: totalEnrollments > 0 ? Math.round((studentsCompleted / totalEnrollments) * 100 * 100) / 100 : 0
      };
    });
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = completionData.filter(data => 
      new Date(data.lastActivity) > sevenDaysAgo
    ).length;
    const engagementMetrics = {
      totalEnrollments,
      completedCourses,
      activeStudents,
      averageCompletionRate,
      recentActivity,
      totalSections
    };
    res.status(200).send({
      success: true,
      data: {
        courseInfo: {
          title: course.C_title,
          educator: course.C_educator,
          category: course.C_categories,
          price: course.C_price,
          totalSections
        },
        engagementMetrics,
        studentProgress: completionData,
        sectionAnalytics,
        recentActivity
      }
    });
  } catch (error) {
    console.error("Error in getCourseAnalyticsController:", error);
    return res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getAllCoursesController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
  editCourseController,
  getCourseAnalyticsController,
};
