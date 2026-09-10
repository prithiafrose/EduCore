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

// Get revenue overview (admin)
const getRevenueOverview = async (req, res) => {
    try {
        const [payments, studentCount, fees] =
            await Promise.all([
                prisma.studentPayment.findMany({
                    include: {
                        fee: true
                    }
                }),
                prisma.student.count(),
                prisma.fee.count()
            ]);

        let collected = 0;
        let outstanding = 0;
        let paidCount = 0;
        let pendingCount = 0;

        payments.forEach((payment) => {
            if (payment.status === "PAID") {
                collected += Number(payment.amount);
                paidCount += 1;
            } else {
                outstanding += Number(payment.amount);
                pendingCount += 1;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                collected,
                outstanding,
                paidCount,
                pendingCount,
                students: studentCount,
                fees: fees,
                totalPayments: payments.length
            }
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