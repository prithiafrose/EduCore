const express = require("express");
const router = express.Router();

const aiController = require("../controllers/ai.controller");
const { authorize } = require("../middleware/role.middleware");

// POST /api/ai/chat  ->  { message }  ->  { reply, intent }
router.post("/chat", aiController.chat);

// POST /api/ai/at-risk-check  ->  scans students and creates notifications
router.post(
    "/at-risk-check",
    authorize("ADMIN", "TEACHER"),
    aiController.checkAtRisk
);

module.exports = router;