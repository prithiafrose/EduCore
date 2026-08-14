const express = require("express");

const courseOfferingController =
    require("../controllers/courseOffering.controller");

const router = express.Router();


// GET all course offerings
router.get(
    "/",
    courseOfferingController.getAllCourseOfferings
);


// GET course offering by ID
router.get(
    "/:id",
    courseOfferingController.getCourseOfferingById
);


// CREATE course offering
router.post(
    "/",
    courseOfferingController.createCourseOffering
);


// UPDATE course offering
router.put(
    "/:id",
    courseOfferingController.updateCourseOffering
);


// DELETE course offering
router.delete(
    "/:id",
    courseOfferingController.deleteCourseOffering
);


module.exports = router;