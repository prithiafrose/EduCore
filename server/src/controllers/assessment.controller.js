const assessmentService = require("../services/assessment.service");

const createAssessment = async (req, res) => {
  try {
    const assessment =
      await assessmentService.createAssessment(req.body);

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssessmentsByCourseOffering = async (req, res) => {
  try {
    const courseOfferingId = Number(
      req.params.courseOfferingId
    );

    const assessments =
      await assessmentService.getAssessmentsByCourseOffering(
        courseOfferingId
      );

    res.status(200).json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAssessment,
  getAssessmentsByCourseOffering,
};