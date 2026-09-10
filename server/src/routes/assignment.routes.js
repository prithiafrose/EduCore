const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourseOffering,
  updateAssignment,
  deleteAssignment,
  downloadAttachment,
} = require("../controllers/assignment.controller");

const {
  authorize
} = require("../middleware/role.middleware");

const { upload } = require("../utils/upload");

router.post("/", authorize("ADMIN", "TEACHER"), upload.single("attachment"), createAssignment);

router.get(
  "/course-offering/:courseOfferingId",
  getAssignmentsByCourseOffering
);

router.get("/:id/attachment", downloadAttachment);

router.get("/", getAllAssignments);

router.get("/:id", getAssignmentById);

router.put("/:id", authorize("ADMIN", "TEACHER"), upload.single("attachment"), updateAssignment);

router.delete("/:id", authorize("ADMIN", "TEACHER"), deleteAssignment);

module.exports = router;