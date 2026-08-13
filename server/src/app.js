const express = require("express");

const app = express();

app.use(express.json());

const departmentRoutes = require("./routes/department.routes");
const programRoutes = require("./routes/program.routes");

app.use("/api/departments", departmentRoutes);
app.use("/api/programs", programRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});

module.exports = app;