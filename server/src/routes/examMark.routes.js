const express = require("express");

const router = express.Router();

const examMarkController = require("../controllers/examMark.controller");

router.post("/", examMarkController.createExamMark);

router.get("/", examMarkController.getAllExamMarks);

router.get("/:id", examMarkController.getExamMarkById);

router.put("/:id", examMarkController.updateExamMark);

router.delete("/:id", examMarkController.deleteExamMark);



module.exports = router;