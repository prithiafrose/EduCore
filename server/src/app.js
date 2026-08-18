const express = require("express");

const app = express();

app.use(express.json());

const departmentRoutes = require("./routes/department.routes");
const programRoutes = require("./routes/program.routes");
const academicSemesterRoutes =
    require("./routes/academicSemester.routes");
    const courseRoutes =
    require("./routes/course.routes");
    const courseOfferingRoutes =
    require("./routes/courseOffering.routes");
    const sectionRoutes =
    require("./routes/section.routes");
    const teacherAssignmentRoutes =
    require("./routes/teacherAssignment.routes");
    const teacherRoutes =
    require("./routes/teacher.routes");
    const userRoutes =
    require("./routes/user.routes");
    const timetableRoutes =
    require("./routes/timetable.routes");
    const studentRoutes =
    require("./routes/student.routes");
    const enrollmentRoutes =
    require("./routes/enrollment.routes");
    const classSessionRoutes =
    require("./routes/classSession.routes");
    const attendanceRoutes =
    require("./routes/attendance.routes");

app.use("/api/departments", departmentRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/academic-semesters", academicSemesterRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/sections", sectionRoutes);
app.use(
    "/api/teacher-assignments",
    teacherAssignmentRoutes
);
app.use(
    "/api/teachers",
    teacherRoutes
);
app.use("/api/users", userRoutes);
app.use(
    "/api/timetables",
    timetableRoutes
);
app.use("/api/students", studentRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use(
    "/api/class-sessions",
    classSessionRoutes
);
app.use(
    "/api/attendances",
    attendanceRoutes
);

app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});

module.exports = app;