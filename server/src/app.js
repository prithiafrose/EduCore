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
    const assessmentRoutes = require("./routes/assessment.routes");
    const assessmentActivityRoutes = require("./routes/assessmentActivity.routes");
    const studentMarkRoutes = require("./routes/studentMark.routes");
    const examMarkRoutes = require("./routes/examMark.routes");
    const examRoutes = require("./routes/exam.routes");
    const assignmentSubmissionRoutes =
  require("./routes/assignmentSubmission.routes");
  const assignmentRoutes =
  require("./routes/assignment.routes");

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
app.use("/api/assessments", assessmentRoutes);
app.use(
  "/api/assessment-activities",
  assessmentActivityRoutes
);
app.use(
    "/api/student-marks",
    studentMarkRoutes
);
app.use("/api/exam-marks", examMarkRoutes);
app.use("/api/exams", examRoutes);
app.use(
  "/api/course-results",
  require("./routes/courseResult.routes")
);
app.use(
  "/api/assignment-submissions",
  assignmentSubmissionRoutes
);
app.use("/api/assignments", assignmentRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});

module.exports = app;