const express = require("express");

const router = express.Router();

const {
  createAssessment,
  getAssessmentsByCourseOffering,
} = require("../controllers/assessment.controller");

const {
  authorize
} = require("../middleware/role.middleware");

router.post(
  "/",
  authorize("ADMIN", "TEACHER"),
  createAssessment
);

router.get(
  "/course-offering/:courseOfferingId",
  getAssessmentsByCourseOffering
);

module.exports = router;