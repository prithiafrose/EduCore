// EduCore AI — authorized, intent-based data retrieval.
// All queries are scoped to the logged-in user (derived from the JWT).
// Students only see their own records; teachers only their assigned courses;
// admins only aggregate statistics.

const prisma = require("../config/prisma");
const {
    calculateGrade
} = require("./courseResult.service");

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

const num = (v) => (v === null || v === undefined ? null : Number(v));

const startOfTodayUtc = () => {
    const now = new Date();
    return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
};

const fmtDate = (d) =>
    d ? new Date(d).toISOString().slice(0, 10) : null;

const fmtTime = (d) =>
    d ? new Date(d).toISOString().slice(11, 16) + " UTC" : null;

const nextWeekdayOccurrence = (weekday, after) => {
    let d = new Date(after);
    d = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    );
    let delta = (weekday - d.getUTCDay() + 7) % 7;
    d.setUTCDate(d.getUTCDate() + delta);
    if (d.getTime() < after.getTime()) {
        d.setUTCDate(d.getUTCDate() + 7);
    }
    return d;
};

const P_ATTENDED = ["PRESENT", "LATE"];

// If the message names a course (code or name), restrict results to it;
// otherwise allow all courses (the intent already scoped the query).
const buildCourseFilter = (message, courses) => {
    const text = String(message || "").toLowerCase();
    const known = (courses || []).filter(Boolean);

    const named = known.filter(
        (c) =>
            (c.code &&
                text.includes(String(c.code).toLowerCase())) ||
            (c.name &&
                text.includes(String(c.name).toLowerCase()))
    );

    return (course) => {
        if (named.length === 0) {
            return true;
        }
        return named.some(
            (n) => n.id === course?.id || n.code === course?.code
        );
    };
};

const courseLabel = (course) =>
    course ? `${course.name} (${course.code})` : "Unknown course";

const getStudentByUserId = (userId) =>
    prisma.student.findUnique({
        where: { userId: Number(userId) },
        include: { program: true }
    });

const getTeacherByUserId = (userId) =>
    prisma.teacher.findUnique({
        where: { userId: Number(userId) },
        include: { department: true }
    });

const getStudentEnrollments = (studentId) =>
    prisma.enrollment.findMany({
        where: { studentId: Number(studentId) },
        include: {
            section: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: {
                        include: { program: true }
                    },
                    teacherAssignments: {
                        include: { teacher: true }
                    },
                    exams: true
                }
            }
        },
        orderBy: { enrolledAt: "asc" }
    });

const getTeacherAssignments = (teacherId) =>
    prisma.teacherAssignment.findMany({
        where: { teacherId: Number(teacherId) },
        include: {
            section: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            }
        }
    });

const teacherForOffering = (enrollment) => {
    const t = enrollment.courseOffering?.teacherAssignments || [];
    const preferred =
        t.find((a) => a.sectionId === enrollment.sectionId) ||
        t[0] ||
        null;
    return preferred ? preferred.teacher?.name : null;
};

// ---------------------------------------------------------------
// Student data
// ---------------------------------------------------------------

const studentAttendanceRows = async (studentId, enrollments, message) => {
    const filter = buildCourseFilter(
        message,
        enrollments.map((e) => e.courseOffering?.course)
    );
    const rows = [];
    let totals = { held: 0, attended: 0, missed: 0 };

    for (const en of enrollments) {
        const course = en.courseOffering?.course;
        if (!filter(course)) {
            continue;
        }

        const offeringId = en.courseOfferingId;
        const sectionMatch = en.sectionId
            ? [
                  { sectionId: en.sectionId },
                  { sectionId: null }
              ]
            : [];

        const sessions = await prisma.classSession.findMany({
            where: {
                courseOfferingId: offeringId,
                status: { not: "CANCELLED" },
                ...(sectionMatch.length > 0
                    ? { OR: sectionMatch }
                    : {})
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

        const attended = marks.filter((m) =>
            P_ATTENDED.includes(m.status)
        ).length;
        const missed = marks.filter((m) => m.status === "ABSENT").length;
        const held = sessions.length;
        const percent =
            held > 0 ? Math.round((attended / held) * 100) : null;

        const row = {
            course: courseLabel(course),
            section: en.section?.name || null,
            held,
            attended,
            missed,
            unmarked: held - attended - missed,
            percent
        };
        rows.push(row);

        totals.held += held;
        totals.attended += attended;
        totals.missed += missed;
    }

    return { rows, totals };
};

const buildStudentSchedule = async (enrollments, message) => {
    const filter = buildCourseFilter(
        message,
        enrollments.map((e) => e.courseOffering?.course)
    );
    const today = startOfTodayUtc();
    const upcoming = [];

    for (const en of enrollments) {
        const course = en.courseOffering?.course;
        if (!filter(course)) {
            continue;
        }

        const sectionMatch = en.sectionId
            ? [
                  { sectionId: en.sectionId },
                  { sectionId: null }
              ]
            : [];

        const sessions = await prisma.classSession.findMany({
            where: {
                courseOfferingId: en.courseOfferingId,
                status: { not: "CANCELLED" },
                date: { gte: today },
                ...(sectionMatch.length > 0
                    ? { OR: sectionMatch }
                    : {})
            },
            include: {
                courseOffering: { include: { course: true } },
                section: true,
                teacher: true
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }]
        });

        sessions.forEach((s) => {
            upcoming.push({
                source: "session",
                course: courseLabel(s.courseOffering.course),
                courseCode: s.courseOffering.course.code,
                courseName: s.courseOffering.course.name,
                section: s.section?.name || null,
                teacher: s.teacher?.name || null,
                date: fmtDate(s.date),
                startTime: fmtTime(s.startTime),
                endTime: fmtTime(s.endTime),
                room: s.room || null
            });
        });

        // Runtime fallback: recurring timetable slots.
        const timetables = await prisma.timetable.findMany({
            where: {
                teacherAssignment: {
                    courseOfferingId: en.courseOfferingId
                },
                ...(en.sectionId
                    ? {
                          OR: [
                              { sectionId: en.sectionId },
                              { sectionId: null }
                          ]
                      }
                    : {})
            },
            include: {
                teacherAssignment: { include: { teacher: true } },
                section: true,
                courseOffering: { include: { course: true } }
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" }
            ]
        });

        timetables.forEach((t) => {
            const tzTime = t.startTime;
            const occ = nextWeekdayOccurrence(t.dayOfWeek, today);
            upcoming.push({
                source: "timetable",
                course: courseLabel(t.courseOffering.course),
                courseCode: t.courseOffering.course.code,
                courseName: t.courseOffering.course.name,
                section: t.section?.name || null,
                teacher: t.teacherAssignment?.teacher?.name || null,
                date: fmtDate(occ),
                startTime: fmtTime(tzTime),
                endTime: fmtTime(t.endTime),
                room: t.room || null
            });
        });
    }

    upcoming.sort((a, b) =>
        (a.date + " " + a.startTime).localeCompare(
            b.date + " " + b.startTime
        )
    );

    const now = new Date();
    let next = null;
    for (const u of upcoming) {
        const dt = new Date(u.date + "T" + u.startTime.slice(0, 5) + ":00Z");
        if (dt >= now) {
            next = u;
            break;
        }
    }

    return { upcoming: upcoming.slice(0, 10), nextClass: next };
};

const buildStudentExams = async (enrollments, message, includeMarks) => {
    const filter = buildCourseFilter(
        message,
        enrollments.map((e) => e.courseOffering?.course)
    );
    const rows = [];

    for (const en of enrollments) {
        const course = en.courseOffering?.course;
        if (!filter(course)) {
            continue;
        }

        const exams = await prisma.exam.findMany({
            where: { courseOfferingId: en.courseOfferingId },
            include: {
                examMarks: {
                    where: { enrollmentId: en.id },
                    select: {
                        marks: true,
                        id: true
                    }
                }
            },
            orderBy: [{ date: "asc" }, { startTime: "asc" }]
        });

        exams.forEach((ex) => {
            const mark = ex.examMarks[0];
            rows.push({
                course: courseLabel(course),
                type: ex.type,
                date: fmtDate(ex.date),
                startTime: fmtTime(ex.startTime),
                endTime: fmtTime(ex.endTime),
                room: ex.room || null,
                maxMarks: num(ex.maxMarks),
                marks: includeMarks ? num(mark?.marks) : null
            });
        });
    }

    const today = startOfTodayUtc();
    const upcoming = rows.filter(
        (r) => r.date && new Date(r.date + "T00:00:00Z") >= today
    );

    return { exams: rows, upcomingExams: upcoming };
};

const buildStudentMarks = async (enrollments, message) => {
    const filter = buildCourseFilter(
        message,
        enrollments.map((e) => e.courseOffering?.course)
    );
    const data = [];

    for (const en of enrollments) {
        const course = en.courseOffering?.course;
        if (!filter(course)) {
            continue;
        }

        const assessments = await prisma.assessment.findMany({
            where: { courseOfferingId: en.courseOfferingId },
            include: {
                activities: {
                    include: {
                        marks: {
                            where: { enrollmentId: en.id },
                            select: { marks: true }
                        }
                    }
                }
            }
        });

        const examMarks = await prisma.examMark.findMany({
            where: { enrollmentId: en.id },
            include: { exam: true }
        });

        data.push({
            course: courseLabel(course),
            assessments: assessments.map((a) => ({
                name: a.name,
                type: a.type,
                maxMarks: num(a.maxMarks),
                marks: num(a.activities[0]?.marks[0]?.marks)
            })),
            exams: examMarks.map((em) => ({
                type: em.exam.type,
                maxMarks: num(em.exam.maxMarks),
                marks: num(em.marks)
            }))
        });
    }

    return { courses: data };
};

const buildStudentResults = async (enrollments) => {
    const results = [];

    for (const en of enrollments) {
        const result = await prisma.courseResult.findUnique({
            where: { enrollmentId: en.id }
        });

        if (!result) {
            continue;
        }

        results.push({
            course: courseLabel(en.courseOffering.course),
            courseCode: en.courseOffering.course.code,
            courseName: en.courseOffering.course.name,
            credit: num(en.courseOffering.course.credit),
            assessmentResult: num(result.assessmentResult),
            examResult: num(result.examResult),
            totalMarks: num(result.totalMarks),
            grade: result.grade,
            gradePoint: num(result.gradePoint)
        });
    }

    let creditSum = 0;
    let gradePointSum = 0;
    let completedCredits = 0;

    results.forEach((r) => {
        if (r.grade && r.grade !== "F" && r.gradePoint !== null) {
            creditSum += r.credit;
            gradePointSum += r.gradePoint * r.credit;
            completedCredits += r.credit;
        }
    });

    const cgpa =
        creditSum > 0
            ? Number((gradePointSum / creditSum).toFixed(2))
            : null;

    return {
        results,
        cgpa,
        completedCredits
    };
};

const buildStudentPayments = async (studentId) => {
    const payments = await prisma.studentPayment.findMany({
        where: { studentId: Number(studentId) },
        include: {
            fee: {
                include: {
                    academicSemester: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const totalDue = payments
        .filter((p) => p.status !== "PAID")
        .reduce((sum, p) => sum + num(p.amount), 0);

    return {
        payments: payments.map((p) => ({
            type: p.fee.type,
            semester: p.fee.academicSemester?.name || null,
            amount: num(p.amount),
            status: p.status,
            dueDate: fmtDate(p.fee.dueDate),
            paidAt: fmtDate(p.paidAt)
        })),
        totalDue,
        hasUnpaid: totalDue > 0
    };
};

const buildStudentNotices = async (userId) => {
    const notifications = await prisma.notification.findMany({
        where: { userId: Number(userId), archivedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    return {
        notices: notifications.map((n) => ({
            type: n.type,
            title: n.title,
            message: n.message,
            isRead: n.isRead,
            createdAt: n.createdAt
        }))
    };
};

// ---------------------------------------------------------------
// Teacher data
// ---------------------------------------------------------------

const teacherScheduleData = async (teacherId, assignments, message) => {
    const today = startOfTodayUtc();
    const offeringIds = assignments.map(
        (a) => a.courseOfferingId
    );

    const sessions = offeringIds.length
        ? await prisma.classSession.findMany({
              where: {
                  teacherId: Number(teacherId),
                  status: { not: "CANCELLED" },
                  date: { gte: today }
              },
              include: {
                  courseOffering: { include: { course: true } },
                  section: true
              },
              orderBy: [{ date: "asc" }, { startTime: "asc" }]
          })
        : [];

    const timetableSlots = assignments.length
        ? await prisma.timetable.findMany({
              where: {
                  teacherAssignmentId: {
                      in: assignments.map((a) => a.id)
                  }
              },
              include: {
                  courseOffering: { include: { course: true } },
                  section: true
              }
          })
        : [];

    const slots = [];

    sessions.forEach((s) => {
        slots.push({
            source: "session",
            course: courseLabel(s.courseOffering.course),
            section: s.section?.name || null,
            date: fmtDate(s.date),
            startTime: fmtTime(s.startTime),
            endTime: fmtTime(s.endTime),
            room: s.room || null
        });
    });

    timetableSlots.forEach((t) => {
        const occ = nextWeekdayOccurrence(t.dayOfWeek, today);
        slots.push({
            source: "recurring",
            course: courseLabel(t.courseOffering.course),
            section: t.section?.name || null,
            date: fmtDate(occ),
            startTime: fmtTime(t.startTime),
            endTime: fmtTime(t.endTime),
            room: t.room || null
        });
    });

    slots.sort((a, b) =>
        (a.date + " " + a.startTime).localeCompare(
            b.date + " " + b.startTime
        )
    );

    return { schedule: slots.slice(0, 10) };
};

const sectionStudentsAttendance = async (offeringId, sectionId, message) => {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            courseOfferingId: offeringId,
            ...(sectionId ? { sectionId } : {})
        },
        include: {
            student: true,
            section: true,
            courseOffering: { include: { course: true } }
        }
    });

    const rows = [];

    for (const en of enrollments) {
        const sectionMatch = en.sectionId
            ? [
                  { sectionId: en.sectionId },
                  { sectionId: null }
              ]
            : [];

        const sessions = await prisma.classSession.findMany({
            where: {
                courseOfferingId: offeringId,
                status: { not: "CANCELLED" },
                ...(sectionMatch.length > 0
                    ? { OR: sectionMatch }
                    : {})
            },
            select: { id: true }
        });
        const sessionIds = sessions.map((s) => s.id);

        const marks = sessionIds.length
            ? await prisma.attendance.findMany({
                  where: {
                      studentId: en.studentId,
                      classSessionId: { in: sessionIds }
                  }
              })
            : [];

        const attended = marks.filter((m) =>
            P_ATTENDED.includes(m.status)
        ).length;
        const held = sessions.length;
        const percent =
            held > 0 ? Math.round((attended / held) * 100) : null;

        rows.push({
            studentId: en.student.studentId,
            name: en.student.name,
            attended,
            held,
            percent
        });
    }

    const course =
        enrollments[0]?.courseOffering?.course || null;
    const section = enrollments[0]?.section?.name || null;

    const filter = buildCourseFilter(message, [course]);
    if (!filter(course)) {
        return { courseLabel: courseLabel(course), section, rows: [] };
    }

    return {
        courseLabel: courseLabel(course),
        section,
        rows,
        below75: rows.filter(
            (r) => r.percent !== null && r.percent < 75
        )
    };
};

const teacherPerformanceData = async (assignments, message) => {
    const filter = buildCourseFilter(
        message,
        assignments.map((a) => a.courseOffering?.course)
    );
    const data = [];

    for (const a of assignments) {
        const course = a.courseOffering?.course;
        if (!filter(course)) {
            continue;
        }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseOfferingId: a.courseOfferingId,
                ...(a.sectionId ? { sectionId: a.sectionId } : {})
            },
            include: {
                student: true,
                result: true
            }
        });

        const assessments = await prisma.assessment.findMany({
            where: { courseOfferingId: a.courseOfferingId },
            include: {
                activities: {
                    include: {
                        marks: {
                            include: { enrollment: { include: { student: true } } }
                        }
                    }
                }
            }
        });

        const examStats = await prisma.examMark.findMany({
            where: {
                enrollmentId: {
                    in: enrollments.map((e) => e.id)
                }
            },
            include: { exam: true }
        });

        const activityStudmarks = assessments.flatMap((as) =>
            (as.activities || []).map((act) => ({
                courseOfferingId: a.courseOfferingId,
                assessment: as.name,
                activity: act.name,
                actMax: num(act.maxMarks),
                marks: (act.marks || []).map((m) => ({
                    studentName: m.enrollment.student.name,
                    marks: num(m.marks)
                }))
            }))
        );

        const resultSummaries = enrollments
            .filter((e) => e.result)
            .map((e) => ({
                studentName: e.student.name,
                totalMarks: num(e.result.totalMarks),
                grade: e.result.grade
            }));

        data.push({
            courseOfferingId: a.courseOfferingId,
            course: courseLabel(course),
            section: a.section?.name || null,
            enrolledStudents: enrollments.map((e) => e.student.name),
            activityStats: activityStudmarks.map((act) => ({
                assessment: act.assessment,
                activity: act.activity,
                maxMarks: act.actMax,
                average: act.marks.length
                    ? Number(
                          (
                              act.marks.reduce((s, m) => s + m.marks, 0) /
                              act.marks.length
                          ).toFixed(2)
                      )
                    : null,
                highest: act.marks.length
                    ? Math.max(...act.marks.map((m) => m.marks))
                    : null,
                scored: act.marks.map((m) => ({
                    student: m.studentName,
                    marks: m.marks
                }))
            })),
            examStats: examStats.map((em) => ({
                type: em.exam.type,
                maxMarks: num(em.exam.maxMarks),
                average: 0,
                highest: 0
            })),
            results: resultSummaries
        });
    }

    return { courses: data };
};

// ---------------------------------------------------------------
// Admin analytics
// ---------------------------------------------------------------

const buildAdminAnalytics = async () => {
    const [
        students,
        teachers,
        courses,
        offerings,
        enrollments,
        departments,
        programs,
        semesters
    ] = await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.course.count(),
        prisma.courseOffering.count(),
        prisma.enrollment.count(),
        prisma.department.count(),
        prisma.program.count(),
        prisma.academicSemester.count()
    ]);

    const payments = await prisma.studentPayment.findMany({
        select: {
            amount: true,
            status: true,
            studentId: true
        }
    });

    const paidRows = payments.filter((p) => p.status === "PAID");
    const pendingRows = payments.filter(
        (p) => p.status === "PENDING"
    );
    const unpaidStudents = new Set(
        payments
            .filter((p) => p.status !== "PAID")
            .map((p) => p.studentId)
    ).size;

    const totalPaid = paidRows.reduce((s, p) => s + num(p.amount), 0);
    const totalPending = pendingRows.reduce(
        (s, p) => s + num(p.amount),
        0
    );

    const attendanceRows = await prisma.attendance.findMany({
        select: { status: true }
    });
    const attendedCount = attendanceRows.filter((a) =>
        P_ATTENDED.includes(a.status)
    ).length;
    const attendancePercent =
        attendanceRows.length > 0
            ? Math.round((attendedCount / attendanceRows.length) * 100)
            : null;

    return {
        counts: {
            students,
            teachers,
            courses,
            courseOfferings: offerings,
            enrollments,
            departments,
            programs,
            academicSemesters: semesters
        },
        payments: {
            transactions: payments.length,
            paidTransactions: paidRows.length,
            totalPaid,
            totalPending,
            unpaidStudents
        },
        attendance: {
            records: attendanceRows.length,
            attended: attendedCount,
            percent: attendancePercent
        },
        generatedAt: new Date().toISOString()
    };
};

// ---------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------

const DATA_INTENTS = [
    "SCHEDULE",
    "NEXT_CLASS",
    "ATTENDANCE",
    "EXAM",
    "MARKS",
    "RESULT",
    "GPA",
    "GRADE",
    "PAYMENT",
    "COURSE",
    "NOTICE",
    "TEACHER_ATTENDANCE",
    "TEACHER_PERFORMANCE",
    "TEACHER_ASSESSMENT",
    "ADMIN_ANALYTICS"
];

/**
 * Retrieve role/intent-scoped data for the authenticated user.
 * @returns {{data: any, description: string|null}}
 */
const getData = async ({ role, userId, intent, message }) => {
    if (!DATA_INTENTS.includes(intent)) {
        return { data: null, description: null };
    }

    if (role === "STUDENT") {
        const student = await getStudentByUserId(userId);
        if (!student) {
            return { data: null, description: "Profile not found" };
        }

        const enrollments = await getStudentEnrollments(student.id);
        const description = `${student.name} (${student.studentId}), program ${student.program?.name || "n/a"}`;

        if (intent === "SCHEDULE" || intent === "NEXT_CLASS") {
            const schedule = await buildStudentSchedule(enrollments, message);
            return {
                data: schedule,
                description
            };
        }

        if (intent === "ATTENDANCE") {
            const attendance = await studentAttendanceRows(
                student.id,
                enrollments,
                message
            );
            return {
                data: attendance,
                description
            };
        }

        if (intent === "EXAM") {
            const exams = await buildStudentExams(
                enrollments,
                message,
                /marks|did i get|what did i get/.test(message)
            );
            return { data: exams, description };
        }

        if (intent === "MARKS") {
            const marks = await buildStudentMarks(enrollments, message);
            return { data: marks, description };
        }

        if (intent === "RESULT" || intent === "GPA") {
            const results = await buildStudentResults(enrollments);
            return { data: results, description };
        }

        if (intent === "GRADE") {
            const results = await buildStudentResults(enrollments);
            return { data: results, description };
        }

        if (intent === "PAYMENT") {
            const payments = await buildStudentPayments(student.id);
            return { data: payments, description };
        }

        if (intent === "COURSE") {
            return {
                data: enrollments.map((en) => ({
                    courseCode: en.courseOffering.course.code,
                    courseName: en.courseOffering.course.name,
                    credit: num(en.courseOffering.course.credit),
                    section: en.section?.name || null,
                    semester:
                        en.courseOffering.academicSemester?.name || null,
                    teacher: teacherForOffering(en)
                })),
                description
            };
        }

        if (intent === "NOTICE") {
            const notices = await buildStudentNotices(userId);
            return { data: notices, description };
        }
    }

    if (role === "TEACHER") {
        const teacher = await getTeacherByUserId(userId);
        if (!teacher) {
            return { data: null, description: "Profile not found" };
        }

        const assignments = await getTeacherAssignments(teacher.id);
        const description = `${teacher.name} (${teacher.employeeId})`;

        if (intent === "SCHEDULE" || intent === "NEXT_CLASS") {
            const schedule = await teacherScheduleData(
                teacher.id,
                assignments,
                message
            );
            return { data: schedule, description };
        }

        if (intent === "TEACHER_ATTENDANCE") {
            const courses = [];
            for (const a of assignments) {
                courses.push(
                    await sectionStudentsAttendance(
                        a.courseOfferingId,
                        a.sectionId,
                        message
                    )
                );
            }
            return { data: { courses }, description };
        }

        if (
            intent === "TEACHER_PERFORMANCE" ||
            intent === "TEACHER_ASSESSMENT"
        ) {
            const performance = await teacherPerformanceData(
                assignments,
                message
            );
            return { data: performance, description };
        }

        if (intent === "EXAM") {
            const exams = await buildStudentExams(
                assignments.map((a) => ({
                    id: a.id,
                    courseOfferingId: a.courseOfferingId,
                    sectionId: a.sectionId,
                    courseOffering: a.courseOffering,
                    section: a.section
                })),
                message,
                false
            );
            return { data: exams, description };
        }
    }

    if (role === "ADMIN" && intent === "ADMIN_ANALYTICS") {
        const analytics = await buildAdminAnalytics();
        return { data: analytics, description: "System analytics" };
    }

    return { data: null, description: null };
};

// ---------------------------------------------------------------
// Data descriptors for the fallback (non-LLM) answer builder
// ---------------------------------------------------------------

const describeData = ({ role, intent, data }) => {
    if (!data) {
        return null;
    }

    // ---------- Student ----------
    if (intent === "SCHEDULE" || intent === "NEXT_CLASS") {
        // Teacher data shape (schedule) takes precedence over student shape.
        if (data.schedule) {
            if (!data.schedule?.length) {
                return "I couldn't find any upcoming classes in EduCore for you.";
            }
            return data.schedule
                .slice(0, 8)
                .map(
                    (s) =>
                        `* ${s.course}${s.section ? " (" + s.section + ")" : ""} on ${s.date} at ${s.startTime}${s.endTime ? " to " + s.endTime : ""}${s.room ? ", " + s.room : ""}.`
                )
                .join("\n");
        }

        const lines = [];
        if (data.upcoming?.length === 0) {
            lines.push(
                "I couldn't find any upcoming classes scheduled in EduCore."
            );
        } else {
            (data.upcoming || []).forEach((s) => {
                lines.push(
                    `* ${s.course}${s.section ? " (" + s.section + ")" : ""} on ${s.date} at ${s.startTime}${s.endTime ? " to " + s.endTime : ""}${s.room ? ", " + s.room : ""}${s.teacher ? ", taught by " + s.teacher : ""}.`
                );
            });
        }
        if (data.nextClass) {
            lines.unshift(
                `Your next class is ${data.nextClass.course} on ${data.nextClass.date} at ${data.nextClass.startTime}${data.nextClass.room ? " in Room " + data.nextClass.room : ""}.`
            );
        }
        return lines.length ? lines.join("\n") : null;
    }

    if (intent === "ATTENDANCE") {
        const lines = [];
        if (!data.rows || data.rows.length === 0) {
            lines.push(
                "I couldn't find any attendance records for you in EduCore."
            );
        } else {
            data.rows.forEach((r) => {
                if (r.held === 0) {
                    lines.push(
                        `* ${r.course}${r.section ? " (" + r.section + ")" : ""}: no classes held yet in EduCore.`
                    );
                    return;
                }
                lines.push(
                    `* ${r.course}${r.section ? " (" + r.section + ")" : ""}: ${r.percent}% (${r.attended} of ${r.held} classes attended, ${r.missed} missed${r.unmarked ? ", " + r.unmarked + " unmarked" : ""}).`
                );
            });
            if (data.totals?.held > 0) {
                const req = Math.ceil(
                    (75 / 100) * data.totals.held
                );
                const needMore = req - data.totals.attended;
                lines.push(
                    `Overall you have attended ${data.totals.attended} of ${data.totals.held} classes. To reach 75% you need ${req} attended classes${needMore > 0 ? ", so you need to attend " + needMore + " more" : ""}.`
                );
            }
        }
        return lines.length ? lines.join("\n") : null;
    }

    if (intent === "EXAM") {
        const list = data.upcomingExams?.length
            ? data.upcomingExams
            : data.exams || [];
        if (!list.length) {
            return "I couldn't find any exams for you in EduCore.";
        }
        return (
            list
                .slice(0, 6)
                .map(
                    (e) =>
                        `* ${e.course} ${e.type} exam on ${e.date} at ${e.startTime}${e.room ? " in " + e.room : ""}${e.marks !== null ? " — your mark: " + e.marks + (e.maxMarks ? "/" + e.maxMarks : "") : e.maxMarks ? " (out of " + e.maxMarks + ")" : ""}.`
                )
                .join("\n") +
            (list.length > 6
                ? "\n… and " + (list.length - 6) + " more."
                : "")
        );
    }

    if (intent === "MARKS") {
        if (!data.courses?.length) {
            return "I couldn't find any assessment marks in EduCore.";
        }
        return data.courses
            .map((c) => {
                const parts = [];
                (c.assessments || []).forEach((a) => {
                    parts.push(
                        `  - ${a.name} (${a.type}): ${a.marks !== null ? a.marks : "not recorded"}${a.maxMarks ? "/" + a.maxMarks : ""}`
                    );
                });
                (c.exams || []).forEach((e) => {
                    parts.push(
                        `  - ${e.type} exam: ${e.marks !== null ? e.marks : "not recorded"}${e.maxMarks ? "/" + e.maxMarks : ""}`
                    );
                });
                return `* ${c.course}:\n` + parts.join("\n");
            })
            .join("\n");
    }

    if (intent === "RESULT") {
        if (!data.results?.length) {
            return "I couldn't find any course results in EduCore.";
        }
        return (
            data.results
                .map(
                    (r) =>
                        `* ${r.course}: ${r.totalMarks} marks (grade ${r.grade}, GPA ${r.gradePoint}).`
                )
                .join("\n") +
            (data.cgpa !== null
                ? `\nYour CGPA is ${data.cgpa} (${data.completedCredits} credits completed).`
                : "")
        );
    }

    if (intent === "GPA") {
        if (data.cgpa === null) {
            return "I couldn't find a computed GPA in EduCore yet.";
        }
        return `Your CGPA is ${data.cgpa}, based on ${data.completedCredits} completed credits.`;
    }

    if (intent === "GRADE") {
        if (!data.results?.length) {
            return "I couldn't find the marks I need to compute a grade projection in EduCore.";
        }
        return data.results
            .map((r) => {
                const grade = calculateGrade(r.totalMarks);
                const needA = 75 - r.totalMarks;
                const needAPlus = 80 - r.totalMarks;
                const line = `* ${r.course}: current total ${r.totalMarks} (${grade.grade}, GPA ${grade.gradePoint}).`;
                const project =
                    "Target A requires 75+/100, A+ requires 80+/100. " +
                    (needA <= 0
                        ? "You already meet an A."
                        : `You need ${needA} more marks on remaining components for an A` +
                          (needAPlus <= 0
                              ? " — already at A+ level."
                              : `, and ${needAPlus} for an A+.`));
                return line + " " + project;
            })
            .join("\n");
    }

    if (intent === "PAYMENT") {
        if (!data.payments?.length) {
            return "I couldn't find any payment records for you in EduCore.";
        }
        return (
            data.payments
                .map(
                    (p) =>
                        `* ${p.type}${p.semester ? " (" + p.semester + ")" : ""}: ${p.amount} — ${p.status}${p.paidAt ? " (paid " + p.paidAt + ")" : ""}${!p.paidAt && p.dueDate ? ", due " + p.dueDate : ""}.`
                )
                .join("\n") +
            `\nTotal outstanding: ${data.totalDue}.`
        );
    }

    if (intent === "COURSE") {
        if (!data.length) {
            return "I couldn't find any enrolled courses in EduCore.";
        }
        const credits = data.reduce(
            (s, c) => s + (c.credit || 0),
            0
        );
        return (
            data
                .map(
                    (c) =>
                        `* ${c.courseName} (${c.courseCode}) — ${c.credit} credits${c.section ? " (" + c.section + ")" : ""}${c.teacher ? ", taught by " + c.teacher : ""}.`
                )
                .join("\n") + `\nTotal credits: ${credits}.`
        );
    }

    if (intent === "NOTICE") {
        if (!data.notices?.length) {
            return "You have no notices in EduCore right now.";
        }
        return data.notices
            .slice(0, 5)
            .map(
                (n) =>
                    `* [${n.type}] ${n.title}: ${n.message} (${n.createdAt ? new Date(n.createdAt).toUTCString() : ""})`
            )
            .join("\n");
    }

    // ---------- Teacher ----------
    if (intent === "TEACHER_ATTENDANCE") {
        const lines = [];
        (data.courses || []).forEach((c) => {
            if (!c.rows?.length) {
                return;
            }
            const summary = c.rows
                .map((r) => `${r.name} (${r.percent !== null ? r.percent + "%" : "n/a"})`)
                .join(", ");
            lines.push(
                `* ${c.courseLabel}${c.section ? " (" + c.section + ")" : ""}: ${summary}.`
            );
            if (c.below75?.length) {
                lines.push(
                    `  Below 75%: ${c.below75.map((b) => b.name).join(", ")}.`
                );
                lines.push(
                    `  That's ${c.below75.length} of ${c.rows.length} students.`
                );
            }
        });
        if (!lines.length) {
            return "I couldn't find attendance data for your courses in EduCore.";
        }
        return lines.join("\n");
    }

    if (
        intent === "TEACHER_PERFORMANCE" ||
        intent === "TEACHER_ASSESSMENT"
    ) {
        const lines = [];
        (data.courses || []).forEach((c) => {
            lines.push(`* ${c.course}${c.section ? " (" + c.section + ")" : ""}:`);
            (c.activityStats || []).forEach((st) => {
                const scored = st.scored
                    .map((m) => `${m.student}: ${m.marks}`)
                    .join(", ");
                lines.push(
                    `  - ${st.activity}: average ${st.average ?? "n/a"}, highest ${st.highest ?? "n/a"}${st.maxMarks ? "/" + st.maxMarks : ""}${
                        scored ? " | " + scored : " | no marks yet"
                    }.`
                );
            });
            if (!c.activityStats?.length) {
                lines.push("  - No assessment activities yet.");
            }
        });
        if (!lines.length) {
            return "I couldn't find assessment data for your courses in EduCore.";
        }
        return lines.join("\n");
    }

    // ---------- Admin ----------
    if (intent === "ADMIN_ANALYTICS") {
        return (
            `EduCore overview:\n` +
            `* Students: ${data.counts?.students}\n` +
            `* Teachers: ${data.counts?.teachers}\n` +
            `* Courses: ${data.counts?.courses}\n` +
            `* Course offerings: ${data.counts?.courseOfferings}\n` +
            `* Enrollments: ${data.counts?.enrollments}\n` +
            `* Payments: ${data.payments?.transactions} total, ${data.payments?.paidTransactions} paid (sum ${data.payments?.totalPaid}), pending sum ${data.payments?.totalPending}, ${data.payments?.unpaidStudents} students with unpaid/failed fees.\n` +
            `* Attendance records: ${data.attendance?.records}, attended ${data.attendance?.attended} (${data.attendance?.percent}%).`
        );
    }

    return null;
};

module.exports = {
    getData,
    describeData
};