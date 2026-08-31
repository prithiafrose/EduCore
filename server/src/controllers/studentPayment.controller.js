const studentPaymentService = require("../services/studentPayment.service");

// Create payment
const createStudentPayment = async (req, res) => {
  try {
    const payment = await studentPaymentService.createStudentPayment(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Student payment created successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all payments
const getAllStudentPayments = async (req, res) => {
  try {
    const payments =
      await studentPaymentService.getAllStudentPayments();

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payment by ID
const getStudentPaymentById = async (req, res) => {
  try {
    const payment =
      await studentPaymentService.getStudentPaymentById(
        req.params.id
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Student payment not found",
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get payments by student
const getPaymentsByStudent = async (req, res) => {
  try {
    const payments =
      await studentPaymentService.getPaymentsByStudent(
        req.params.studentId
      );

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const payment =
      await studentPaymentService.updatePaymentStatus(
        req.params.id,
        req.body.status
      );

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: payment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete payment
const deleteStudentPayment = async (req, res) => {
  try {
    await studentPaymentService.deleteStudentPayment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Student payment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudentPayment,
  getAllStudentPayments,
  getStudentPaymentById,
  getPaymentsByStudent,
  updatePaymentStatus,
  deleteStudentPayment,
};