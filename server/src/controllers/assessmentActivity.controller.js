const assessmentActivityService = require("../services/assessmentActivity.service");

const createAssessmentActivity = async (req, res) => {
  try {
    const activity =
      await assessmentActivityService.createAssessmentActivity(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Assessment activity created successfully",
      data: activity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getActivitiesByAssessment = async (req, res) => {
  try {
    const assessmentId = Number(req.params.assessmentId);

    const activities =
      await assessmentActivityService.getActivitiesByAssessment(
        assessmentId
      );

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAssessmentActivity,
  getActivitiesByAssessment,
};