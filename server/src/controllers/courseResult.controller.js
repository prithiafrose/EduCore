const courseResultService = require("../services/courseResult.service");

const prisma = require("../config/prisma");

// Generate Course Result
const generateCourseResult = async (req, res) => {
  try {
    const result =
      await courseResultService.generateCourseResult(
        req.params.enrollmentId
      );

    res.status(200).json({
      success: true,
      message: "Course result generated successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Course Results
const getAllCourseResults = async (req, res) => {
  try {
    const results =
      await courseResultService.getAllCourseResults();

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Course Result By Enrollment
const getCourseResultByEnrollment = async (req, res) => {
  try {
    const result =
      await courseResultService.getCourseResultByEnrollment(
        req.params.enrollmentId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Student Transcript
const getStudentTranscript = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    if (
      !Number.isInteger(studentId) ||
      studentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    // Access control:
    // - Admin can view any transcript
    // - A student can only view their own transcript
    if (req.user?.role !== "ADMIN") {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });

      if (
        !student ||
        student.userId !== Number(req.user?.userId)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const transcript =
      await courseResultService.getStudentTranscript(
        studentId
      );

    res.status(200).json({
      success: true,
      data: transcript,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  generateCourseResult,
  getAllCourseResults,
  getCourseResultByEnrollment,
  getStudentTranscript,
};