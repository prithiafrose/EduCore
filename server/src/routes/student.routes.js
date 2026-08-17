const express = require("express");

const studentController =
    require("../controllers/student.controller");

const router = express.Router();


// GET all students
router.get(
    "/",
    studentController.getAllStudents
);


// GET student by ID
router.get(
    "/:id",
    studentController.getStudentById
);


// CREATE student
router.post(
    "/",
    studentController.createStudent
);


// UPDATE student
router.put(
    "/:id",
    studentController.updateStudent
);


// DELETE student
router.delete(
    "/:id",
    studentController.deleteStudent
);


module.exports = router;