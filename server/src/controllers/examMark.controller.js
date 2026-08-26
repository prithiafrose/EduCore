const examMarkService = require("../services/examMark.service");

// Create Exam Mark
const createExamMark = async (req, res) => {
  try {
    const examMark = await examMarkService.createExamMark(req.body);

    res.status(201).json({
      success: true,
      message: "Exam mark created successfully",
      data: examMark,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Exam Marks
const getAllExamMarks = async (req, res) => {
  try {
    const examMarks = await examMarkService.getAllExamMarks();

    res.status(200).json({
      success: true,
      data: examMarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Exam Mark By ID
const getExamMarkById = async (req, res) => {
  try {
    const examMark = await examMarkService.getExamMarkById(req.params.id);

    res.status(200).json({
      success: true,
      data: examMark,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Exam Mark
const updateExamMark = async (req, res) => {
  try {
    const examMark = await examMarkService.updateExamMark(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Exam mark updated successfully",
      data: examMark,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Exam Mark
const deleteExamMark = async (req, res) => {
  try {
    const result = await examMarkService.deleteExamMark(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createExamMark,
  getAllExamMarks,
  getExamMarkById,
  updateExamMark,
  deleteExamMark
};