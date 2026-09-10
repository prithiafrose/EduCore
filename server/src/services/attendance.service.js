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
        "Attendance has already been taken for this student."
    );
}

// Lock attendance after class day
const today = new Date();
today.setHours(0, 0, 0, 0);

const classDate = new Date(classSession.date);
classDate.setHours(0, 0, 0, 0);

if (today > classDate) {
    throw new Error(
        "Attendance is locked. You cannot create attendance after the class date."
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
  // Find attendance + class session
  const existingAttendance = await prisma.attendance.findUnique({
    where: { id: Number(id) },
    include: { classSession: true },
  });

  if (!existingAttendance) {
        throw new Error("Attendance not found");
    }

  const session = existingAttendance.classSession;

  // Cannot modify cancelled class
  if (session.status === "CANCELLED") {
    throw new Error(
      "Cannot update attendance for a cancelled class session"
    );
  }

  // -----------------------------
  // LOCK AFTER CLASS DAY
  // -----------------------------
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const classDate = new Date(session.date);
  classDate.setHours(0, 0, 0, 0);

  if (today > classDate) {
    throw new Error(
      "Attendance is locked. It cannot be modified after the class date."
    );
  }

  // Validate status
  const validStatuses = ["PRESENT", "ABSENT", "LATE"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid attendance status");
  }

  return await prisma.attendance.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      classSession: true,
      student: true,
    },
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
// ----------------------------------------------
// GET Attendance Marks (/10) for a Course Offering
// ----------------------------------------------
const getAttendanceMarksByCourseOffering = async (
  courseOfferingId
) => {
  const students = await prisma.enrollment.findMany({
    where: {
      courseOfferingId: Number(courseOfferingId),
    },
    include: {
      student: true,
    },
    orderBy: {
      studentId: "asc",
    },
  });

  const classSessions =
    await prisma.classSession.findMany({
      where: {
        courseOfferingId: Number(courseOfferingId),
        status: "FINISHED",
      },
      select: {
        id: true,
      },
    });

  const totalClasses = classSessions.length;

  const results = await Promise.all(
    students.map(async (enrollment) => {
      const attendanceCount =
        await prisma.attendance.count({
          where: {
            studentId: enrollment.studentId,
            classSessionId: {
              in: classSessions.map((c) => c.id),
            },
            status: {
              in: ["PRESENT", "LATE"],
            },
          },
        });

      const percentage =
        totalClasses === 0
          ? 0
          : (attendanceCount / totalClasses) * 100;

      let attendanceMarks = 0;

      if (percentage >= 90) attendanceMarks = 10;
      else if (percentage >= 80) attendanceMarks = 9;
      else if (percentage >= 70) attendanceMarks = 8;
      else if (percentage >= 60) attendanceMarks = 7;
      else if (percentage >= 50) attendanceMarks = 6;
      else if (percentage >= 40) attendanceMarks = 5;

      return {
        enrollmentId: enrollment.id,
        studentId: enrollment.student.studentId,
        studentName: enrollment.student.name,
        totalClasses,
        attendedClasses: attendanceCount,
        attendancePercentage: Number(
          percentage.toFixed(2)
        ),
        attendanceMarks,
      };
    })
  );

  return results;
};
const getClassroomAttendance = async (courseOfferingId) => {
    const id = Number(courseOfferingId);

    // Get all students enrolled in this course
    const enrollments = await prisma.enrollment.findMany({
        where: {
            courseOfferingId: id
        },
        include: {
            student: true
        },
        orderBy: {
            studentId: "asc"
        }
    });

    // Get all finished class sessions
    const classSessions = await prisma.classSession.findMany({
        where: {
            courseOfferingId: id,
            status: "FINISHED"
        },
        orderBy: {
            date: "asc"
        }
    });

    // Get all attendance records for these sessions
    const attendances = await prisma.attendance.findMany({
        where: {
            classSession: {
                courseOfferingId: id
            }
        }
    });

    return {
        classSessions,
        students: enrollments.map((enrollment) => {
            const studentAttendances = classSessions.map(
                (session) => {
                    const attendance = attendances.find(
                        (item) =>
                            item.classSessionId === session.id &&
                            item.studentId === enrollment.studentId
                    );

                    return {
                        classSessionId: session.id,
                        status: attendance
                            ? attendance.status
                            : null
                    };
                }
            );

            const attendedClasses =
                studentAttendances.filter(
                    (item) =>
                        item.status === "PRESENT" ||
                        item.status === "LATE"
                ).length;

            const totalClasses = classSessions.length;

            const attendancePercentage =
                totalClasses === 0
                    ? 0
                    : (attendedClasses / totalClasses) * 100;

            return {
                studentId: enrollment.student.id,
                studentCode: enrollment.student.studentId,
                studentName: enrollment.student.name,

                attendance: studentAttendances,

                totalClasses,
                attendedClasses,

                attendancePercentage: Number(
                    attendancePercentage.toFixed(2)
                )
            };
        })
    };
};
// GET attendance records by student ID
const getAttendancesByStudentId = async (studentId) => {
    return await prisma.attendance.findMany({
        where: {
            studentId: Number(studentId)
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
            }
        },
        orderBy: {
            id: "asc"
        }
    });
};
module.exports = {
  getAllAttendances,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    getAttendancesByClassSession,
    getAttendanceMarksByCourseOffering,
    getClassroomAttendance,
    getAttendancesByStudentId



};