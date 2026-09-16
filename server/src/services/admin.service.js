const prisma = require("../config/prisma");

// GET admin dashboard statistics
const getAdminStats = async () => {
    const [students, teachers, courses, departments] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.course.count(),
        prisma.department.count()
    ]);

    return { students, teachers, courses, departments };
};

// GET revenue overview
const getRevenueOverview = async () => {
    const [payments, studentCount, fees] = await Promise.all([
        prisma.studentPayment.findMany({
            include: { fee: true }
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

    return {
        collected,
        outstanding,
        paidCount,
        pendingCount,
        students: studentCount,
        fees,
        totalPayments: payments.length
    };
};

module.exports = {
    getAdminStats,
    getRevenueOverview
};
