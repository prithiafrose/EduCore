const express = require("express");

const teacherAssignmentController =
    require("../controllers/teacherAssignment.controller");

const router = express.Router();


// GET all teacher assignments
router.get(
    "/",
    teacherAssignmentController.getAllTeacherAssignments
);


// GET teacher assignment by ID
router.get(
    "/:id",
    teacherAssignmentController.getTeacherAssignmentById
);


// CREATE teacher assignment
router.post(
    "/",
    teacherAssignmentController.createTeacherAssignment
);


module.exports = router;