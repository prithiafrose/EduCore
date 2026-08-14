const express = require("express");

const courseController =
    require("../controllers/course.controller");

const router = express.Router();


// GET all courses
router.get(
    "/",
    courseController.getAllCourses
);


// GET course by ID
router.get(
    "/:id",
    courseController.getCourseById
);


// CREATE course
router.post(
    "/",
    courseController.createCourse
);


// UPDATE course
router.put(
    "/:id",
    courseController.updateCourse
);


// DELETE course
router.delete(
    "/:id",
    courseController.deleteCourse
);


module.exports = router;