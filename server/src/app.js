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

app.use("/api/departments", departmentRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/academic-semesters", academicSemesterRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/course-offerings", courseOfferingRoutes);
app.use("/api/sections", sectionRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});

module.exports = app;