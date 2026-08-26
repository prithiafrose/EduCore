const examService = require("../services/exam.service");

// Create Exam
const createExam = async (req, res) => {
  try {
    const exam = await examService.createExam(req.body);

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Exams
const getAllExams = async (req, res) => {
  try {
    const exams = await examService.getAllExams();

    res.status(200).json({
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Exam By ID
const getExamById = async (req, res) => {
  try {
    const exam = await examService.getExamById(req.params.id);

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Exam
const updateExam = async (req, res) => {
  try {
    const exam = await examService.updateExam(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Exam
const deleteExam = async (req, res) => {
  try {
    const result = await examService.deleteExam(req.params.id);

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
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};