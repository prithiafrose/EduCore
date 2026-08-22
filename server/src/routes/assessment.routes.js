const express = require("express");

const router = express.Router();

const {
  createAssessment,
  getAssessmentsByCourseOffering,
} = require("../controllers/assessment.controller");

router.post("/", createAssessment);

router.get(
  "/course-offering/:courseOfferingId",
  getAssessmentsByCourseOffering
);

module.exports = router;