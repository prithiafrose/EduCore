const express = require("express");

const router = express.Router();

const courseResultController =
  require("../controllers/courseResult.controller");

const {
  authorize
} = require("../middleware/role.middleware");

router.post(
  "/generate/:enrollmentId",
  authorize("ADMIN"),
  courseResultController.generateCourseResult
);

router.get(
  "/",
  courseResultController.getAllCourseResults
);

router.get(
  "/student/:studentId/transcript",
  courseResultController.getStudentTranscript
);

router.get(
  "/enrollment/:enrollmentId",
  courseResultController.getCourseResultByEnrollment
);

module.exports = router;