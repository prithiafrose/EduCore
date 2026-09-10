const express = require("express");

const router = express.Router();

const {
  createAssessmentActivity,
  getActivitiesByAssessment,
} = require("../controllers/assessmentActivity.controller");

const {
  authorize
} = require("../middleware/role.middleware");

router.post(
  "/",
  authorize("ADMIN", "TEACHER"),
  createAssessmentActivity
);

router.get(
  "/assessment/:assessmentId",
  getActivitiesByAssessment
);

module.exports = router;