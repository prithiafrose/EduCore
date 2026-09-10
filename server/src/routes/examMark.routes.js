const express = require("express");

const router = express.Router();

const examMarkController = require("../controllers/examMark.controller");

const {
  authorize
} = require("../middleware/role.middleware");

router.post("/", authorize("ADMIN", "TEACHER"), examMarkController.createExamMark);

router.get("/", examMarkController.getAllExamMarks);

router.get("/:id", examMarkController.getExamMarkById);

router.put("/:id", authorize("ADMIN", "TEACHER"), examMarkController.updateExamMark);

router.delete("/:id", authorize("ADMIN", "TEACHER"), examMarkController.deleteExamMark);



module.exports = router;