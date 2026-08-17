const express = require("express");

const teacherController =
    require("../controllers/teacher.controller");

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
    teacherController.createTeacher
);


// UPDATE teacher
router.put(
    "/:id",
    teacherController.updateTeacher
);


// DELETE teacher
router.delete(
    "/:id",
    teacherController.deleteTeacher
);


module.exports = router;