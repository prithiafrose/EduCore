const express = require("express");

const router = express.Router();

const {
  createStudentPayment,
  getAllStudentPayments,
  getStudentPaymentById,
  getPaymentsByStudent,
  updatePaymentStatus,
  checkoutStudentPayment,
  downloadReceipt,
  deleteStudentPayment,
} = require("../controllers/studentPayment.controller");

const {
  authorize
} = require("../middleware/role.middleware");

// Create payment
router.post("/", createStudentPayment);

// Get payments by student
router.get("/student/:studentId", getPaymentsByStudent);

// Get all payments
router.get("/", getAllStudentPayments);

// Get payment by ID
router.get("/:id", getStudentPaymentById);

// Download payment receipt (HTML)
router.get(
  "/:id/receipt",
  downloadReceipt
);

// Update payment status (admin only)
router.put(
  "/:id/status",
  authorize("ADMIN"),
  updatePaymentStatus
);

// Checkout payment (starts gateway flow)
router.post(
  "/:id/checkout",
  authorize("ADMIN", "STUDENT"),
  checkoutStudentPayment
);

// Delete payment (admin only)
router.delete("/:id", authorize("ADMIN"), deleteStudentPayment);

module.exports = router;