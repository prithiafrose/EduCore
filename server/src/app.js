require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5176",
];
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
    })
);

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
const courseRegistrationRoutes = require("./routes/courseRegistration.routes");
const feeRoutes = require("./routes/fee.routes");
const studentPaymentRoutes = require("./routes/studentPayment.routes");
const notificationRoutes =
    require("./routes/notification.routes");
    const authRoutes =
    require("./routes/auth.routes");
    const adminRoutes = require("./routes/admin.routes");
const aiRoutes = require("./routes/ai.routes");
const {
    authenticate
} = require("./middleware/auth.middleware");

app.use("/api/auth", authRoutes);

// Public catalog routes (used by the public register page)
app.use("/api/public", require("./routes/public.routes"));

// Public payment gateway routes (redirects + webhooks)
app.use(
    "/api/payments",
    require("./routes/paymentGateway.routes")
);

app.use("/api", authenticate);

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
app.use("/api/course-materials", require("./routes/courseMaterial.routes"));
app.use("/api/course-registrations", courseRegistrationRoutes);

app.use("/api/fees", feeRoutes);
app.use("/api/student-payments", studentPaymentRoutes);
app.use(
    "/api/notifications",
    notificationRoutes
);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});

module.exports = app;