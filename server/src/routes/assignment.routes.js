const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourseOffering,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignment.controller");

router.post("/", createAssignment);

router.get(
  "/course-offering/:courseOfferingId",
  getAssignmentsByCourseOffering
);

router.get("/", getAllAssignments);

router.get("/:id", getAssignmentById);

router.put("/:id", updateAssignment);

router.delete("/:id", deleteAssignment);

module.exports = router;