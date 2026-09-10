const express = require("express");

const timetableController =
    require("../controllers/timetable.controller");

const {
    authorize
} = require("../middleware/role.middleware");

const router = express.Router();


// GET all timetables
router.get(
    "/",
    timetableController.getAllTimetables
);
router.get(
    "/student/:studentId",
    timetableController.getTimetablesByStudentId
);


// GET timetable by ID
router.get(
    "/:id",
    timetableController.getTimetableById
);


// CREATE timetable
router.post(
    "/",
    authorize("ADMIN"),
    timetableController.createTimetable
);


// UPDATE timetable
router.put(
    "/:id",
    authorize("ADMIN"),
    timetableController.updateTimetable
);


// DELETE timetable
router.delete(
    "/:id",
    authorize("ADMIN"),
    timetableController.deleteTimetable
);


module.exports = router;