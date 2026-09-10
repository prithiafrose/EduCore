const express = require("express");

const router = express.Router();

const examController = require("../controllers/exam.controller");

const {
  authorize
} = require("../middleware/role.middleware");

router.post("/", authorize("ADMIN", "TEACHER"), examController.createExam);

router.get("/", examController.getAllExams);

router.get("/:id", examController.getExamById);

router.put("/:id", authorize("ADMIN", "TEACHER"), examController.updateExam);

router.delete("/:id", authorize("ADMIN", "TEACHER"), examController.deleteExam);

module.exports = router;