const prisma = require("../config/prisma");

const getAllAttendances = async () => {
    return await prisma.attendance.findMany({
        include: {
            classSession: {
                include: {
                    courseOffering: {
                        include: {
                            course: true,
                            academicSemester: true
                        }
                    },
                    section: true,
                    teacher: true
                }
            },
            student: true
        },
        orderBy: {
            id: "asc"
        }
    });
};
const getAttendanceById = async (id) => {
    return await prisma.attendance.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            classSession: {
                include: {
                    courseOffering: {
                        include: {
                            course: true,
                            academicSemester: true
                        }
                    },
                    section: true,
                    teacher: true
                }
            },
            student: true
        }
    });
};
const createAttendance = async ({
    classSessionId,
    studentId,
    status
}) => {

    // Check class session
    const classSession =
        await prisma.classSession.findUnique({
            where: {
                id: Number(classSessionId)
            }
        });

    if (!classSession) {
        throw new Error("Class session not found");
    }


    // Cancelled classes should not have attendance
    if (classSession.status === "CANCELLED") {
        throw new Error(
            "Cannot mark attendance for a cancelled class session"
        );
    }


    // Check student
    const student =
        await prisma.student.findUnique({
            where: {
                id: Number(studentId)
            }
        });

    if (!student) {
        throw new Error("Student not found");
    }


    // Check student enrollment
    const enrollment =
        await prisma.enrollment.findUnique({
            where: {
                studentId_courseOfferingId: {
                    studentId: Number(studentId),
                    courseOfferingId:
                        classSession.courseOfferingId
                }
            }
        });

    if (!enrollment) {
        throw new Error(
            "Student is not enrolled in this course offering"
        );
    }


    // Check duplicate attendance
    const existingAttendance =
        await prisma.attendance.findUnique({
            where: {
                classSessionId_studentId: {
                    classSessionId: Number(classSessionId),
                    studentId: Number(studentId)
                }
            }
        });

    if (existingAttendance) {
        throw new Error(
            "Attendance already exists for this student"
        );
    }


    // Create attendance
    return await prisma.attendance.create({
        data: {
            classSessionId: Number(classSessionId),
            studentId: Number(studentId),
            status
        },
        include: {
            classSession: {
                include: {
                    courseOffering: {
                        include: {
                            course: true,
                            academicSemester: true
                        }
                    },
                    section: true,
                    teacher: true
                }
            },
            student: true
        }
    });
};
const updateAttendance = async (id, status) => {

    // Check attendance
    const existingAttendance =
        await prisma.attendance.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                classSession: true
            }
        });

    if (!existingAttendance) {
        throw new Error("Attendance not found");
    }

    // Do not modify attendance for cancelled classes
    if (existingAttendance.classSession.status === "CANCELLED") {
        throw new Error(
            "Cannot update attendance for a cancelled class session"
        );
    }

    // Validate status
    const validStatuses = [
        "PRESENT",
        "ABSENT",
        "LATE"
    ];

    if (!validStatuses.includes(status)) {
        throw new Error("Invalid attendance status");
    }

    return await prisma.attendance.update({
        where: {
            id: Number(id)
        },
        data: {
            status
        },
        include: {
            classSession: {
                include: {
                    courseOffering: {
                        include: {
                            course: true,
                            academicSemester: true
                        }
                    },
                    section: true,
                    teacher: true
                }
            },
            student: true
        }
    });
};
const getAttendancesByClassSession = async (classSessionId) => {

    const classSession =
        await prisma.classSession.findUnique({
            where: {
                id: Number(classSessionId)
            }
        });

    if (!classSession) {
        throw new Error("Class session not found");
    }

    return await prisma.attendance.findMany({
        where: {
            classSessionId: Number(classSessionId)
        },
        include: {
            student: true
        },
        orderBy: {
            studentId: "asc"
        }
    });
};
module.exports = {
    getAllAttendances,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    getAttendancesByClassSession

};