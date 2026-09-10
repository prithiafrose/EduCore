const express = require("express");

const studentController =
    require("../controllers/student.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all students
router.get(
    "/",
    studentController.getAllStudents
);


// GET student by user ID
router.get(
    "/user/:userId",
    studentController.getStudentByUserId
);


// GET student by ID
router.get(
    "/:id",
    studentController.getStudentById
);


// CREATE student
router.post(
    "/",
    authorize("ADMIN"),
    studentController.createStudent
);


// UPDATE student
router.put(
    "/:id",
    authorize("ADMIN"),
    studentController.updateStudent
);


// DELETE student
router.delete(
    "/:id",
    authorize("ADMIN"),
    studentController.deleteStudent
);


module.exports = router;