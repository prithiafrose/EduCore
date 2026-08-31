const express = require("express");

const router = express.Router();

const {
  createCourseRegistration,
  getAllCourseRegistrations,
  getCourseRegistrationById,
  getRegistrationsByStudent,
  updateRegistrationStatus,
  deleteCourseRegistration,
} = require("../controllers/courseRegistration.controller");

// Create registration
router.post("/", createCourseRegistration);

// Get registrations of one student
router.get("/student/:studentId", getRegistrationsByStudent);

// Get all registrations
router.get("/", getAllCourseRegistrations);

// Get one registration
router.get("/:id", getCourseRegistrationById);

// Approve / Reject registration
router.put("/:id/status", updateRegistrationStatus);

// Delete registration
router.delete("/:id", deleteCourseRegistration);

module.exports = router;
