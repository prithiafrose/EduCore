const prisma = require("../config/prisma");
const getAllStudentMarks = async () => {
    return await prisma.studentMark.findMany({
        include: {
            assessmentActivity: {
                include: {
                    assessment: true
                }
            },
            enrollment: true
        },
        orderBy: {
            id: "asc"
        }
    });
};
const getStudentMarkById = async (id) => {
    const studentMark = await prisma.studentMark.findUnique({
        where: {
            id
        },
        include: {
            assessmentActivity: {
                include: {
                    assessment: true
                }
            },
            enrollment: true
        }
    });

    if (!studentMark) {
        throw new Error("Student mark not found");
    }

    return studentMark;
};

const createStudentMark = async ({
    enrollmentId,
    assessmentActivityId,
    marks
}) => {
    // Check assessment activity
    const activity = await prisma.assessmentActivity.findUnique({
        where: {
            id: assessmentActivityId
        }
    });

    if (!activity) {
        throw new Error("Assessment activity not found");
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        }
    });

    if (!enrollment) {
        throw new Error("Enrollment not found");
    }

    // Validate marks
    if (marks < 0) {
        throw new Error("Marks cannot be negative");
    }

    if (Number(marks) > Number(activity.maxMarks)) {
        throw new Error(
            `Marks cannot be greater than maximum marks (${activity.maxMarks})`
        );
    }

    // Check duplicate mark
    const existingMark = await prisma.studentMark.findUnique({
        where: {
            assessmentActivityId_enrollmentId: {
                assessmentActivityId,
                enrollmentId
            }
        }
    });

    if (existingMark) {
        throw new Error(
            "Marks already exist for this student and assessment activity"
        );
    }

    return await prisma.studentMark.create({
        data: {
            enrollmentId,
            assessmentActivityId,
            marks
        }
    });
};
const updateStudentMark = async (id, marks) => {
    const studentMark = await prisma.studentMark.findUnique({
        where: {
            id
        },
        include: {
            assessmentActivity: true
        }
    });

    if (!studentMark) {
        throw new Error("Student mark not found");
    }

    if (marks < 0) {
        throw new Error("Marks cannot be negative");
    }

    if (
        Number(marks) >
        Number(studentMark.assessmentActivity.maxMarks)
    ) {
        throw new Error(
            `Marks cannot be greater than maximum marks (${studentMark.assessmentActivity.maxMarks})`
        );
    }

    return await prisma.studentMark.update({
        where: {
            id
        },
        data: {
            marks
        }
    });
};
const deleteStudentMark = async (id) => {
    const studentMark = await prisma.studentMark.findUnique({
        where: {
            id
        }
    });

    if (!studentMark) {
        throw new Error("Student mark not found");
    }

    return await prisma.studentMark.delete({
        where: {
            id
        }
    });
};
const getMarksByEnrollment = async (enrollmentId) => {
    return await prisma.studentMark.findMany({
        where: {
            enrollmentId
        },
        include: {
            assessmentActivity: {
                include: {
                    assessment: true
                }
            }
        },
        orderBy: {
            id: "asc"
        }
    });
};
const getMarksByActivity = async (assessmentActivityId) => {
    return await prisma.studentMark.findMany({
        where: {
            assessmentActivityId
        },
        include: {
            enrollment: true
        },
        orderBy: {
            id: "asc"
        }
    });
};

module.exports = {
    getStudentMarkById,
    createStudentMark,
      updateStudentMark,
         getAllStudentMarks,
         deleteStudentMark,
             getMarksByEnrollment,
             getMarksByActivity

};