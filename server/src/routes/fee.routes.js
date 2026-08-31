const express = require("express");

const router = express.Router();

const {
  createFee,
  getAllFees,
  getFeeById,
  getFeesByProgram,
  getFeesBySemester,
  updateFee,
  deleteFee,
} = require("../controllers/fee.controller");

// Create fee
router.post("/", createFee);

// Get fees by program
router.get("/program/:programId", getFeesByProgram);

// Get fees by academic semester
router.get("/semester/:academicSemesterId", getFeesBySemester);

// Get all fees
router.get("/", getAllFees);

// Get fee by ID
router.get("/:id", getFeeById);

// Update fee
router.put("/:id", updateFee);

// Delete fee
router.delete("/:id", deleteFee);

module.exports = router;