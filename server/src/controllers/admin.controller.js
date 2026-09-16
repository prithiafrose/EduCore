const adminService = require("../services/admin.service");

const getAdminStats = async (req, res) => {
    try {
        const data = await adminService.getAdminStats();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Admin statistics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};

const getRevenueOverview = async (req, res) => {
    try {
        const data = await adminService.getRevenueOverview();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error("Admin revenue error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch revenue overview"
        });
    }
};

module.exports = {
    getAdminStats,
    getRevenueOverview
};
