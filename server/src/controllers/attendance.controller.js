const attendanceService =
    require("../services/attendance.service");


// GET /api/attendances
const getAllAttendances = async (req, res) => {
    try {
        const attendances =
            await attendanceService.getAllAttendances();

        res.status(200).json({
            success: true,
            data: attendances
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET /api/attendances/:id
const getAttendanceById = async (req, res) => {
    try {
        const attendance =
            await attendanceService.getAttendanceById(
                req.params.id
            );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        res.status(200).json({
            success: true,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// POST /api/attendances
const createAttendance = async (req, res) => {
    try {
        const attendance =
            await attendanceService.createAttendance(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Attendance created successfully",
            data: attendance
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// PUT /api/attendances/:id
const updateAttendance = async (req, res) => {
    try {
        const attendance =
            await attendanceService.updateAttendance(
                req.params.id,
                req.body.status
            );

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: attendance
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// GET /api/attendances/class-session/:classSessionId
const getAttendancesByClassSession = async (req, res) => {
    try {
        const attendances =
            await attendanceService.getAttendancesByClassSession(
                req.params.classSessionId
            );

        res.status(200).json({
            success: true,
            data: attendances
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET Attendance Marks for Course Offering
const getAttendanceMarksByCourseOffering = async (
  req,
  res
) => {
  try {
    const courseOfferingId = Number(
      req.params.courseOfferingId
    );

    const marks =
      await attendanceService.getAttendanceMarksByCourseOffering(
        courseOfferingId
      );

    res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getClassroomAttendance = async (req, res) => {
    try {
        const courseOfferingId = Number(
            req.params.courseOfferingId
        );

        const attendance =
            await attendanceService.getClassroomAttendance(
                courseOfferingId
            );

        res.status(200).json({
            success: true,
            data: attendance
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
// GET attendance records by student ID
const getAttendancesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (
            !Number.isInteger(Number(studentId)) ||
            Number(studentId) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const attendances =
            await attendanceService.getAttendancesByStudentId(
                studentId
            );

        res.status(200).json({
            success: true,
            data: attendances
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllAttendances,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    getAttendancesByClassSession,
    getAttendanceMarksByCourseOffering,
        getClassroomAttendance,
        getAttendancesByStudentId

};