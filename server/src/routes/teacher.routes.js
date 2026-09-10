const express = require("express");

const teacherController =
    require("../controllers/teacher.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all teachers
router.get(
    "/",
    teacherController.getAllTeachers
);


// GET teacher by ID
router.get(
    "/:id",
    teacherController.getTeacherById
);


// CREATE teacher
router.post(
    "/",
    authorize("ADMIN"),
    teacherController.createTeacher
);


// UPDATE teacher
router.put(
    "/:id",
    authorize("ADMIN", "TEACHER"),
    teacherController.updateTeacher
);


// DELETE teacher
router.delete(
    "/:id",
    authorize("ADMIN"),
    teacherController.deleteTeacher
);


module.exports = router;