const service = require("../services/assignmentSubmission.service");

const createAssignmentSubmission = async (req, res) => {
  try {
    const submission =
      await service.createAssignmentSubmission(req.body);

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await service.getSubmissionById(
      Number(req.params.id)
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions =
      await service.getSubmissionsByAssignment(
        Number(req.params.assignmentId)
      );

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSubmissionsByStudent = async (req, res) => {
  try {
    const submissions =
      await service.getSubmissionsByStudent(
        Number(req.params.studentId)
      );

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const submission = await service.updateSubmission(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Submission updated successfully",
      data: submission,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    await service.deleteSubmission(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAssignmentSubmission,
  getSubmissionById,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  updateSubmission,
  deleteSubmission,
};