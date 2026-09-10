const express = require("express");
const router = express.Router();

const attendanceController =
    require("../controllers/attendance.controller");

const {
    authorize
} = require("../middleware/role.middleware");


// GET all attendances
router.get(
    "/",
    attendanceController.getAllAttendances
);


// GET attendance records by class session
router.get(
    "/class-session/:classSessionId",
    attendanceController.getAttendancesByClassSession
);


// GET full classroom attendance
router.get(
    "/course-offering/:courseOfferingId/classroom",
    attendanceController.getClassroomAttendance
);


// GET attendance marks by course offering
router.get(
    "/course-offering/:courseOfferingId/marks",
    attendanceController.getAttendanceMarksByCourseOffering
);
// GET attendance records by student
router.get(
    "/student/:studentId",
    attendanceController.getAttendancesByStudentId
);


// GET attendance by ID
router.get(
    "/:id",
    attendanceController.getAttendanceById
);


// CREATE attendance
router.post(
    "/",
    authorize("ADMIN", "TEACHER"),
    attendanceController.createAttendance
);


// UPDATE attendance
router.put(
    "/:id",
    authorize("ADMIN", "TEACHER"),
    attendanceController.updateAttendance
);


module.exports = router;