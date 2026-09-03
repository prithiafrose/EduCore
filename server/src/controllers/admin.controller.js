const prisma = require("../config/prisma");

const getAdminStats = async (req, res) => {
    try {
        const [
            students,
            teachers,
            courses,
            departments
        ] = await Promise.all([
            prisma.student.count(),
            prisma.teacher.count(),
            prisma.course.count(),
            prisma.department.count()
        ]);

        res.status(200).json({
            success: true,
            data: {
                students,
                teachers,
                courses,
                departments
            }
        });

    } catch (error) {
        console.error("Admin statistics error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};

module.exports = {
    getAdminStats
};