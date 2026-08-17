const express = require("express");

const timetableController =
    require("../controllers/timetable.controller");

const router = express.Router();


// GET all timetables
router.get(
    "/",
    timetableController.getAllTimetables
);


// GET timetable by ID
router.get(
    "/:id",
    timetableController.getTimetableById
);


// CREATE timetable
router.post(
    "/",
    timetableController.createTimetable
);


// UPDATE timetable
router.put(
    "/:id",
    timetableController.updateTimetable
);


// DELETE timetable
router.delete(
    "/:id",
    timetableController.deleteTimetable
);


module.exports = router;