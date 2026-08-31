const express = require("express");

const router = express.Router();

const {
  createStudentPayment,
  getAllStudentPayments,
  getStudentPaymentById,
  getPaymentsByStudent,
  updatePaymentStatus,
  deleteStudentPayment,
} = require("../controllers/studentPayment.controller");

// Create payment
router.post("/", createStudentPayment);

// Get payments by student
router.get("/student/:studentId", getPaymentsByStudent);

// Get all payments
router.get("/", getAllStudentPayments);

// Get payment by ID
router.get("/:id", getStudentPaymentById);

// Update payment status
router.put("/:id/status", updatePaymentStatus);

// Delete payment
router.delete("/:id", deleteStudentPayment);

module.exports = router;