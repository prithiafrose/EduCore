const express = require("express");

const app = express();

app.use(express.json());
const departmentRoutes = require("./routes/department.routes");

app.get("/", (req, res) => {
    res.json({
        message: "EduCore API is running"
    });
});
app.use("/api/departments", departmentRoutes);
module.exports = app;