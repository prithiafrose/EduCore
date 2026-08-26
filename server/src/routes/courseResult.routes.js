const express = require("express");

const router = express.Router();

const courseResultController =
  require("../controllers/courseResult.controller");

router.post(
  "/generate/:enrollmentId",
  courseResultController.generateCourseResult
);

router.get(
  "/",
  courseResultController.getAllCourseResults
);

router.get(
  "/enrollment/:enrollmentId",
  courseResultController.getCourseResultByEnrollment
);

module.exports = router;