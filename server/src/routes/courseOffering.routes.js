const express = require("express");

const courseOfferingController =
    require("../controllers/courseOffering.controller");

const {
    authorize
} = require("../middleware/role.middleware");

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
    authorize("ADMIN"),
    courseOfferingController.createCourseOffering
);


// UPDATE course offering
router.put(
    "/:id",
    authorize("ADMIN"),
    courseOfferingController.updateCourseOffering
);


// DELETE course offering
router.delete(
    "/:id",
    authorize("ADMIN"),
    courseOfferingController.deleteCourseOffering
);


module.exports = router;