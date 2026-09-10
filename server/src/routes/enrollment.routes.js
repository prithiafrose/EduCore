const express = require("express");

const enrollmentController =
    require("../controllers/enrollment.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all enrollments
router.get(
    "/",
    enrollmentController.getAllEnrollments
);


// GET enrollments by student ID
router.get(
    "/student/:studentId",
    enrollmentController.getEnrollmentsByStudentId
);


// GET enrollment by ID
router.get(
    "/:id",
    enrollmentController.getEnrollmentById
);


// CREATE enrollment
router.post(
    "/",
    authorize("ADMIN"),
    enrollmentController.createEnrollment
);


// UPDATE enrollment
router.put(
    "/:id",
    authorize("ADMIN"),
    enrollmentController.updateEnrollment
);


// DELETE enrollment
router.delete(
    "/:id",
    authorize("ADMIN"),
    enrollmentController.deleteEnrollment
);


module.exports = router;