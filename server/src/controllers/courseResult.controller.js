const courseResultService = require("../services/courseResult.service");

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


module.exports = {
  generateCourseResult,
  getAllCourseResults,
  getCourseResultByEnrollment,
};