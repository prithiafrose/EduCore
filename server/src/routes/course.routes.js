const express = require("express");

const courseController =
    require("../controllers/course.controller");

const {
    authorize
} = require("../middleware/role.middleware");

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
    authorize("ADMIN"),
    courseController.createCourse
);


// UPDATE course
router.put(
    "/:id",
    authorize("ADMIN"),
    courseController.updateCourse
);


// DELETE course
router.delete(
    "/:id",
    authorize("ADMIN"),
    courseController.deleteCourse
);


module.exports = router;