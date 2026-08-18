const express = require("express");

const router = express.Router();

const attendanceController =
    require("../controllers/attendance.controller");


// GET all attendances
router.get(
    "/",
    attendanceController.getAllAttendances
);


// GET attendances for a specific class session
// IMPORTANT: Keep this BEFORE /:id
router.get(
    "/class-session/:classSessionId",
    attendanceController.getAttendancesByClassSession
);


// GET attendance by ID
router.get(
    "/:id",
    attendanceController.getAttendanceById
);


// CREATE attendance
router.post(
    "/",
    attendanceController.createAttendance
);


// UPDATE attendance
router.put(
    "/:id",
    attendanceController.updateAttendance
);


module.exports = router;