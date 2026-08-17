const express = require("express");

const enrollmentController =
    require("../controllers/enrollment.controller");

const router = express.Router();


// GET all enrollments
router.get(
    "/",
    enrollmentController.getAllEnrollments
);


// GET enrollment by ID
router.get(
    "/:id",
    enrollmentController.getEnrollmentById
);


// CREATE enrollment
router.post(
    "/",
    enrollmentController.createEnrollment
);


// UPDATE enrollment
router.put(
    "/:id",
    enrollmentController.updateEnrollment
);


// DELETE enrollment
router.delete(
    "/:id",
    enrollmentController.deleteEnrollment
);


module.exports = router;