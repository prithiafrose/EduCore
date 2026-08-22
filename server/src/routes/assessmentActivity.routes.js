const express = require("express");

const router = express.Router();

const {
  createAssessmentActivity,
  getActivitiesByAssessment,
} = require("../controllers/assessmentActivity.controller");

router.post("/", createAssessmentActivity);

router.get(
  "/assessment/:assessmentId",
  getActivitiesByAssessment
);

module.exports = router;