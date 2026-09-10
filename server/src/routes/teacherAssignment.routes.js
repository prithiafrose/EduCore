const express = require("express");

const teacherAssignmentController =
    require("../controllers/teacherAssignment.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all teacher assignments
router.get(
    "/",
    teacherAssignmentController.getAllTeacherAssignments
);


// GET teacher assignment by ID

router.get(
    "/teacher/:teacherId",
    teacherAssignmentController.getTeacherAssignmentsByTeacher
);
router.get(
    "/:id",
    teacherAssignmentController.getTeacherAssignmentById
);


// CREATE teacher assignment
router.post(
    "/",
    authorize("ADMIN"),
    teacherAssignmentController.createTeacherAssignment
);


// DELETE teacher assignment
router.delete(
    "/:id",
    authorize("ADMIN"),
    teacherAssignmentController.deleteTeacherAssignment
);


module.exports = router;