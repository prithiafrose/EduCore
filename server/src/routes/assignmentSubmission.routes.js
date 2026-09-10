const express = require("express");

const router = express.Router();

const {
  createAssignmentSubmission,
  getSubmissionById,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  updateSubmission,
  deleteSubmission,
  downloadSubmission,
} = require("../controllers/assignmentSubmission.controller");

const {
  authorize
} = require("../middleware/role.middleware");

const { upload } = require("../utils/upload");

router.post("/", authorize("STUDENT"), upload.single("file"), createAssignmentSubmission);

router.get(
  "/assignment/:assignmentId",
  getSubmissionsByAssignment
);

router.get("/:id/download", downloadSubmission);

router.get(
  "/student/:studentId",
  getSubmissionsByStudent
);

router.get("/:id", getSubmissionById);

router.put("/:id", authorize("ADMIN", "TEACHER"), updateSubmission);

router.delete("/:id", authorize("ADMIN", "TEACHER"), deleteSubmission);

module.exports = router;