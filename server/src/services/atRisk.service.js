// EduCore — At-Risk Student Early-Warning Service
// Scans students for attendance <75%, unpaid fees, and failing grades.
// Creates notifications for at-risk students and returns a structured report.

const prisma = require("../config/prisma");
const notificationService = require("./notification.service");

const P_ATTENDED = ["PRESENT", "LATE"];
const ATTENDANCE_THRESHOLD = 75;

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

const getStudentByUserId = (userId) =>
    prisma.student.findUnique({ where: { userId: Number(userId) } });

const getTeacherByUserId = (userId) =>
    prisma.teacher.findUnique({ where: { userId: Number(userId) } });

const getTeacherAssignedStudentUserIds = async (teacherId) => {
    const assignments = await prisma.teacherAssignment.findMany({
        where: { teacherId: Number(teacherId) },
        select: { courseOfferingId: true, sectionId: true }
    });

    if (!assignments.length) return [];

    const conditions = assignments.map((a) => ({
        courseOfferingId: a.courseOfferingId,
        ...(a.sectionId ? { sectionId: a.sectionId } : {})
    }));

    const enrollments = await prisma.enrollment.findMany({
        where: { OR: conditions },
        select: { studentId: true }
    });

    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
    if (!studentIds.length) return [];

    const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: { userId: true }
    });

    return students.map((s) => s.userId).filter(Boolean);
};

const getAllStudentUserIds = async () => {
    const students = await prisma.student.findMany({
        select: { userId: true }
    });
    return students.map((s) => s.userId).filter(Boolean);
};

// ---------------------------------------------------------------
// Individual risk checks
// ---------------------------------------------------------------

const checkAttendanceRisk = async (studentId) => {
    const enrollments = await prisma.enrollment.findMany({
        where: { studentId: Number(studentId) },
        select: {
            courseOfferingId: true,
            sectionId: true,
            courseOffering: { select: { course: { select: { name: true, code: true } } } }
        }
    });

    let totalHeld = 0;
    let totalAttended = 0;
    const courseBreakdown = [];

    for (const en of enrollments) {
        const sectionMatch = en.sectionId
            ? [{ sectionId: en.sectionId }, { sectionId: null }]
            : [];

        const sessions = await prisma.classSession.findMany({
            where: {
                courseOfferingId: en.courseOfferingId,
                status: { not: "CANCELLED" },
                ...(sectionMatch.length > 0 ? { OR: sectionMatch } : {})
            },
            select: { id: true }
        });

        const sessionIds = sessions.map((s) => s.id);
        const marks = sessionIds.length
            ? await prisma.attendance.findMany({
                  where: {
                      studentId: Number(studentId),
                      classSessionId: { in: sessionIds }
                  }
              })
            : [];

        const attended = marks.filter((m) => P_ATTENDED.includes(m.status)).length;
        const held = sessions.length;
        const percent = held > 0 ? Math.round((attended / held) * 100) : null;

        totalHeld += held;
        totalAttended += attended;

        if (percent !== null && percent < ATTENDANCE_THRESHOLD && held > 0) {
            courseBreakdown.push({
                course: `${en.courseOffering?.course?.name || "Unknown"} (${en.courseOffering?.course?.code || "?"})`,
                attended,
                held,
                percent
            });
        }
    }

    const overallPercent = totalHeld > 0
        ? Math.round((totalAttended / totalHeld) * 100)
        : null;

    return {
        isAtRisk: overallPercent !== null && overallPercent < ATTENDANCE_THRESHOLD && totalHeld > 0,
        overallPercent,
        totalAttended,
        totalHeld,
        courses: courseBreakdown
    };
};

const checkPaymentRisk = async (studentId) => {
    const payments = await prisma.studentPayment.findMany({
        where: {
            studentId: Number(studentId),
            status: { not: "PAID" }
        },
        include: {
            fee: {
                select: {
                    type: true,
                    dueDate: true,
                    academicSemester: { select: { name: true } }
                }
            }
        }
    });

    const totalDue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
        isAtRisk: payments.length > 0,
        totalDue,
        unpaidCount: payments.length,
        details: payments.map((p) => ({
            type: p.fee?.type || "Fee",
            semester: p.fee?.academicSemester?.name || null,
            amount: Number(p.amount || 0),
            dueDate: p.fee?.dueDate ? new Date(p.fee.dueDate).toISOString().slice(0, 10) : null
        }))
    };
};

const checkGradeRisk = async (studentId) => {
    const results = await prisma.courseResult.findMany({
        where: { enrollment: { studentId: Number(studentId) } },
        include: {
            enrollment: {
                include: {
                    courseOffering: {
                        include: { course: { select: { name: true, code: true } } }
                    }
                }
            }
        }
    });

    const failing = results.filter(
        (r) => r.grade === "F" || (r.totalMarks !== null && Number(r.totalMarks) < 40)
    );

    return {
        isAtRisk: failing.length > 0,
        failingCount: failing.length,
        details: failing.map((r) => ({
            course: `${r.enrollment?.courseOffering?.course?.name || "Unknown"} (${r.enrollment?.courseOffering?.course?.code || "?"})`,
            totalMarks: r.totalMarks !== null ? Number(r.totalMarks) : null,
            grade: r.grade
        }))
    };
};

// ---------------------------------------------------------------
// Build risk message for notification
// ---------------------------------------------------------------

const buildRiskMessage = (studentName, reasons) => {
    const parts = [];

    if (reasons.includes("ATTENDANCE")) {
        parts.push("attendance below 75%");
    }
    if (reasons.includes("PAYMENT")) {
        parts.push("unpaid fees");
    }
    if (reasons.includes("GRADE")) {
        parts.push("one or more failing grades");
    }

    return `Dear ${studentName}, an early-warning check has identified you as at-risk due to: ${parts.join(", ")}. Please contact your academic advisor immediately to discuss a support plan.`;
};

// ---------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------

const runAtRiskCheck = async ({ userId, role }) => {
    let studentUserIds = [];

    if (role === "ADMIN") {
        studentUserIds = await getAllStudentUserIds();
    } else if (role === "TEACHER") {
        const teacher = await getTeacherByUserId(userId);
        if (!teacher) {
            throw new Error("Teacher profile not found.");
        }
        studentUserIds = await getTeacherAssignedStudentUserIds(teacher.id);
    } else {
        throw new Error("Only admins and teachers can run at-risk checks.");
    }

    if (!studentUserIds.length) {
        return {
            report: [],
            summary: { totalChecked: 0, atRiskCount: 0, attendanceRisk: 0, paymentRisk: 0, gradeRisk: 0 },
            summaryText: "No students found to check.",
            notificationsSent: 0,
            checkedAt: new Date().toISOString()
        };
    }

    const report = [];
    let attendanceRisk = 0;
    let paymentRisk = 0;
    let gradeRisk = 0;
    let notificationsSent = 0;

    for (const uid of studentUserIds) {
        const student = await getStudentByUserId(uid);
        if (!student) continue;

        const [attendance, payments, grades] = await Promise.all([
            checkAttendanceRisk(student.id),
            checkPaymentRisk(student.id),
            checkGradeRisk(student.id)
        ]);

        const reasons = [];
        if (attendance.isAtRisk) reasons.push("ATTENDANCE");
        if (payments.isAtRisk) reasons.push("PAYMENT");
        if (grades.isAtRisk) reasons.push("GRADE");

        if (reasons.length > 0) {
            if (attendance.isAtRisk) attendanceRisk++;
            if (payments.isAtRisk) paymentRisk++;
            if (grades.isAtRisk) gradeRisk++;

            report.push({
                studentId: student.id,
                studentIdCode: student.studentId,
                name: student.name,
                userId: uid,
                reasons,
                details: {
                    attendance: attendance.isAtRisk ? {
                        percent: attendance.overallPercent,
                        attended: attendance.totalAttended,
                        held: attendance.totalHeld,
                        courses: attendance.courses
                    } : null,
                    payments: payments.isAtRisk ? {
                        totalDue: payments.totalDue,
                        unpaidCount: payments.unpaidCount,
                        details: payments.details
                    } : null,
                    grades: grades.isAtRisk ? {
                        failingCount: grades.failingCount,
                        details: grades.details
                    } : null
                }
            });

            try {
                await notificationService.createNotification({
                    userId: uid,
                    type: "GENERAL",
                    title: "At-Risk Student Warning",
                    message: buildRiskMessage(student.name, reasons)
                });
                notificationsSent++;
            } catch (notifErr) {
                console.error(`Failed to create at-risk notification for student ${student.name}:`, notifErr.message);
            }
        }
    }

    const totalChecked = studentUserIds.length;
    const atRiskCount = report.length;

    const summaryText = atRiskCount === 0
        ? `All ${totalChecked} students are within safe academic thresholds. No at-risk students detected.`
        : `Out of ${totalChecked} students checked, ${atRiskCount} at-risk student${atRiskCount > 1 ? "s" : ""} detected: ${attendanceRisk} attendance risk${attendanceRisk !== 1 ? "s" : ""}, ${paymentRisk} payment risk${paymentRisk !== 1 ? "s" : ""}, ${gradeRisk} grade risk${gradeRisk !== 1 ? "s" : ""}. Notifications have been sent to all at-risk students.`;

    return {
        report,
        summary: { totalChecked, atRiskCount, attendanceRisk, paymentRisk, gradeRisk },
        summaryText,
        notificationsSent,
        checkedAt: new Date().toISOString()
    };
};

module.exports = { runAtRiskCheck };
