const express = require("express");

const router = express.Router();

const {
  createAssignmentSubmission,
  getSubmissionById,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  updateSubmission,
  deleteSubmission,
} = require("../controllers/assignmentSubmission.controller");

router.post("/", createAssignmentSubmission);

router.get(
  "/assignment/:assignmentId",
  getSubmissionsByAssignment
);

router.get(
  "/student/:studentId",
  getSubmissionsByStudent
);

router.get("/:id", getSubmissionById);

router.put("/:id", updateSubmission);

router.delete("/:id", deleteSubmission);

module.exports = router;