const prisma = require("../config/prisma");

const getAllClassSessions = async () => {
    return await prisma.classSession.findMany({
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacher: true,
            timetable: true,
            rescheduledFrom: true,
            rescheduledTo: true,
            attendances: true
        },
        orderBy: {
            date: "asc"
        }
    });
};
const getClassSessionById = async (id) => {
    return await prisma.classSession.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacher: true,
            timetable: true,
            rescheduledFrom: true,
            rescheduledTo: true,
            attendances: true
        }
    });
};
const createClassSession = async ({
    courseOfferingId,
    sectionId,
    teacherId,
    timetableId,
    date,
    startTime,
    endTime,
    room
}) => {

    // Check course offering
    const courseOffering =
        await prisma.courseOffering.findUnique({
            where: {
                id: Number(courseOfferingId)
            }
        });

    if (!courseOffering) {
        throw new Error("Course offering not found");
    }


    // Check section
    if (sectionId) {
        const section = await prisma.section.findUnique({
            where: {
                id: Number(sectionId)
            }
        });

        if (!section) {
            throw new Error("Section not found");
        }

        // Make sure section belongs to this course offering
        if (section.courseOfferingId !== Number(courseOfferingId)) {
            throw new Error(
                "Section does not belong to this course offering"
            );
        }
    }


    // Check teacher
    const teacher = await prisma.teacher.findUnique({
        where: {
            id: Number(teacherId)
        }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }


    // Check timetable if provided
    if (timetableId) {
        const timetable = await prisma.timetable.findUnique({
            where: {
                id: Number(timetableId)
            }
        });

        if (!timetable) {
            throw new Error("Timetable not found");
        }
    }


    // Validate time
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
        throw new Error(
            "End time must be after start time"
        );
    }


    // Create class session
    return await prisma.classSession.create({
        data: {
            courseOfferingId: Number(courseOfferingId),
            sectionId: sectionId
                ? Number(sectionId)
                : null,
            teacherId: Number(teacherId),
            timetableId: timetableId
                ? Number(timetableId)
                : null,
            date: new Date(date),
            startTime: start,
            endTime: end,
            room: room || null
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacher: true,
            timetable: true
        }
    });
};
const updateClassSession = async (id, {
    courseOfferingId,
    sectionId,
    teacherId,
    timetableId,
    date,
    startTime,
    endTime,
    room
}) => {

    // Check existing class session
    const existingSession =
        await prisma.classSession.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!existingSession) {
        throw new Error("Class session not found");
    }


    // Determine final course offering
    const finalCourseOfferingId =
        courseOfferingId !== undefined
            ? Number(courseOfferingId)
            : existingSession.courseOfferingId;


    // Check course offering
    const courseOffering =
        await prisma.courseOffering.findUnique({
            where: {
                id: finalCourseOfferingId
            }
        });

    if (!courseOffering) {
        throw new Error("Course offering not found");
    }


    // Determine final section
    const finalSectionId =
        sectionId !== undefined
            ? sectionId
                ? Number(sectionId)
                : null
            : existingSession.sectionId;


    // Check section
    if (finalSectionId !== null) {

        const section =
            await prisma.section.findUnique({
                where: {
                    id: finalSectionId
                }
            });

        if (!section) {
            throw new Error("Section not found");
        }

        if (
            section.courseOfferingId !==
            finalCourseOfferingId
        ) {
            throw new Error(
                "Section does not belong to this course offering"
            );
        }
    }


    // Determine final teacher
    const finalTeacherId =
        teacherId !== undefined
            ? Number(teacherId)
            : existingSession.teacherId;


    // Check teacher
    const teacher =
        await prisma.teacher.findUnique({
            where: {
                id: finalTeacherId
            }
        });

    if (!teacher) {
        throw new Error("Teacher not found");
    }


    // Determine final timetable
    const finalTimetableId =
        timetableId !== undefined
            ? timetableId
                ? Number(timetableId)
                : null
            : existingSession.timetableId;


    // Check timetable
    if (finalTimetableId !== null) {

        const timetable =
            await prisma.timetable.findUnique({
                where: {
                    id: finalTimetableId
                }
            });

        if (!timetable) {
            throw new Error("Timetable not found");
        }
    }


    // Determine final date/time
    const finalDate =
        date !== undefined
            ? new Date(date)
            : existingSession.date;

    const finalStartTime =
        startTime !== undefined
            ? new Date(startTime)
            : existingSession.startTime;

    const finalEndTime =
        endTime !== undefined
            ? new Date(endTime)
            : existingSession.endTime;


    // Validate time
    if (finalEndTime <= finalStartTime) {
        throw new Error(
            "End time must be after start time"
        );
    }


    // Update
    return await prisma.classSession.update({
        where: {
            id: Number(id)
        },

        data: {
            courseOfferingId: finalCourseOfferingId,
            sectionId: finalSectionId,
            teacherId: finalTeacherId,
            timetableId: finalTimetableId,
            date: finalDate,
            startTime: finalStartTime,
            endTime: finalEndTime,

            ...(room !== undefined && {
                room: room || null
            })
        },

        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacher: true,
            timetable: true
        }
    });
};
const cancelClassSession = async (id) => {
    const existingSession =
        await prisma.classSession.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!existingSession) {
        throw new Error("Class session not found");
    }

    if (existingSession.status === "CANCELLED") {
        throw new Error("Class session is already cancelled");
    }

    return await prisma.classSession.update({
        where: {
            id: Number(id)
        },
        data: {
            status: "CANCELLED"
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacher: true,
            timetable: true
        }
    });
};
const rescheduleClassSession = async (
    id,
    {
        date,
        startTime,
        endTime,
        room,
        teacherId,
        sectionId,
        timetableId
    }
) => {

    // Find original session
    const originalSession =
        await prisma.classSession.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!originalSession) {
        throw new Error("Class session not found");
    }


    // A cancelled class can be rescheduled
    // A completed class should not be rescheduled
    if (originalSession.status === "COMPLETED") {
        throw new Error(
            "Completed class session cannot be rescheduled"
        );
    }


    // Prevent rescheduling the same session twice
    const existingRescheduled =
        await prisma.classSession.findFirst({
            where: {
                rescheduledFromId: Number(id)
            }
        });

    if (existingRescheduled) {
        throw new Error(
            "This class session has already been rescheduled"
        );
    }


    // Final values
    const finalTeacherId =
        teacherId !== undefined
            ? Number(teacherId)
            : originalSession.teacherId;

    const finalSectionId =
        sectionId !== undefined
            ? sectionId
                ? Number(sectionId)
                : null
            : originalSession.sectionId;

    const finalTimetableId =
        timetableId !== undefined
            ? timetableId
                ? Number(timetableId)
                : null
            : originalSession.timetableId;


    // Validate teacher
    const teacher =
        await prisma.teacher.findUnique({
            where: {
                id: finalTeacherId
            }
        });

    if (!teacher) {
        throw new Error("Teacher not found");
    }


    // Validate section
    if (finalSectionId !== null) {

        const section =
            await prisma.section.findUnique({
                where: {
                    id: finalSectionId
                }
            });

        if (!section) {
            throw new Error("Section not found");
        }

        if (
            section.courseOfferingId !==
            originalSession.courseOfferingId
        ) {
            throw new Error(
                "Section does not belong to this course offering"
            );
        }
    }


    // Validate timetable
    if (finalTimetableId !== null) {

        const timetable =
            await prisma.timetable.findUnique({
                where: {
                    id: finalTimetableId
                }
            });

        if (!timetable) {
            throw new Error("Timetable not found");
        }
    }


    // Validate time
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    if (newEndTime <= newStartTime) {
        throw new Error(
            "End time must be after start time"
        );
    }


    // Transaction:
    // 1. Cancel original session
    // 2. Create new session
    return await prisma.$transaction(async (tx) => {

        const updatedOriginal =
            await tx.classSession.update({
                where: {
                    id: Number(id)
                },
                data: {
                    status: "CANCELLED"
                }
            });


        const newSession =
            await tx.classSession.create({
                data: {
                    courseOfferingId:
                        originalSession.courseOfferingId,

                    sectionId: finalSectionId,

                    teacherId: finalTeacherId,

                    timetableId: finalTimetableId,

                    date: new Date(date),

                    startTime: newStartTime,

                    endTime: newEndTime,

                    room:
                        room !== undefined
                            ? room || null
                            : originalSession.room,

                    rescheduledFromId:
                        originalSession.id
                },

                include: {
                    courseOffering: {
                        include: {
                            course: true,
                            academicSemester: true
                        }
                    },
                    section: true,
                    teacher: true,
                    timetable: true
                }
            });


        return {
            originalSession: updatedOriginal,
            newSession
        };
    });
};
module.exports = {
    getAllClassSessions,
     getClassSessionById,
     createClassSession,
      updateClassSession,
      cancelClassSession,
      rescheduleClassSession
};
      
