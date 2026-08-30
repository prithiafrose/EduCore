const service = require("../services/assignment.service");

const createAssignment = async (req, res) => {
  try {
    const assignment = await service.createAssignment(req.body);

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await service.getAllAssignments();

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await service.getAssignmentById(
      Number(req.params.id)
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignmentsByCourseOffering = async (req, res) => {
  try {
    const assignments =
      await service.getAssignmentsByCourseOffering(
        Number(req.params.courseOfferingId)
      );

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await service.updateAssignment(
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await service.deleteAssignment(Number(req.params.id));

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourseOffering,
  updateAssignment,
  deleteAssignment,
};