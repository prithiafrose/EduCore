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

const {
  authorize
} = require("../middleware/role.middleware");

// Create registration
router.post("/", createCourseRegistration);

// Get registrations of one student
router.get("/student/:studentId", getRegistrationsByStudent);

// Get all registrations
router.get("/", getAllCourseRegistrations);

// Get one registration
router.get("/:id", getCourseRegistrationById);

// Approve / Reject registration
router.put("/:id/status", authorize("ADMIN"), updateRegistrationStatus);

// Delete registration
router.delete(
  "/:id",
  authorize("ADMIN", "STUDENT"),
  deleteCourseRegistration
);

module.exports = router;