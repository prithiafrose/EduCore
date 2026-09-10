const prisma = require("../config/prisma");
const notificationService = require("./notification.service");

// Time-of-day key (UTC HH:MM) so we can match recurring timetable slots
const timeKey = (dt) =>
    new Date(dt).toISOString().slice(11, 16);

// Weekday (0=Sunday..6=Saturday) computed from the UTC date, so it is
// stable regardless of the server timezone
const dayOfWeekUtc = (dt) => {
    const datePart = new Date(dt).toISOString().slice(0, 10);
    return new Date(datePart + "T00:00:00Z").getUTCDay();
};

// Find the teacher's assignment for this offering (prefer the exact
// section, fall back to any assignment of the same teacher+offering)
const findTeacherAssignment = async ({
    courseOfferingId,
    sectionId,
    teacherId
}) => {
    const base = {
        teacherId: Number(teacherId),
        courseOfferingId: Number(courseOfferingId)
    };

    if (sectionId) {
        const exact =
            await prisma.teacherAssignment.findFirst({
                where: { ...base, sectionId: Number(sectionId) }
            });

        if (exact) {
            return exact;
        }
    }

    return await prisma.teacherAssignment.findFirst({
        where: base
    });
};

// Find or create the recurring timetable slot for a class session so the
// session shows up in teacher/student class routine. Best-effort: returns
// null when the teacher has no assignment for the offering.
const resolveTimetableForSession = async ({
    courseOfferingId,
    sectionId,
    teacherId,
    date,
    startTime,
    endTime,
    room
}) => {
    const assignment = await findTeacherAssignment({
        courseOfferingId,
        sectionId,
        teacherId
    });

    if (!assignment) {
        return null;
    }

    const dayOfWeek = dayOfWeekUtc(date);
    const startKey = timeKey(startTime);
    const endKey = timeKey(endTime);

    const slots = await prisma.timetable.findMany({
        where: {
            courseOfferingId: Number(courseOfferingId),
            teacherAssignmentId: assignment.id,
            dayOfWeek
        }
    });

    const existing = slots.find((t) =>
        timeKey(t.startTime) === startKey &&
        timeKey(t.endTime) === endKey
    );

    if (existing) {
        return existing.id;
    }

    const created = await prisma.timetable.create({
        data: {
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId
                    ? Number(sectionId)
                    : assignment.sectionId ?? null,
            teacherAssignmentId: assignment.id,
            dayOfWeek,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            room: room || null
        }
    });

    return created.id;
};

// Human-readable description of a session for notification messages
const describeSession = (session) => {
    const course =
        session.courseOffering?.course?.name ||
        `Course ${session.courseOfferingId}`;

    const code =
        session.courseOffering?.course?.code || "";

    const section = session.section?.name
        ? ` (Section ${session.section.name})`
        : "";

    const date =
        new Date(session.date).toISOString().slice(0, 10);

    const time = `${timeKey(session.startTime)} - ${timeKey(session.endTime)}`;

    const room = session.room
        ? `, Room ${session.room}`
        : "";

    return `${code} ${course}${section} on ${date} at ${time}${room}.`;
};

// Notify the classroom teacher + all enrolled students of a session event.
// Best-effort: never throws so session operations are not blocked.
const notifyClassParticipants = async ({
    courseOfferingId,
    teacherUserId,
    type,
    title,
    message
}) => {
    try {
        const enrollments =
            await prisma.enrollment.findMany({
                where: {
                    courseOfferingId: Number(courseOfferingId)
                },
                include: {
                    student: {
                        select: { userId: true }
                    }
                }
            });

        const userIds = [
            teacherUserId,
            ...enrollments.map((e) => e.student.userId)
        ];

        for (const userId of userIds) {
            if (!userId) {
                continue;
            }

            try {
                await notificationService.createNotification({
                    userId,
                    type,
                    title,
                    message
                });
            } catch (err) {
                console.error(
                    "Failed to notify user " + userId + ":",
                    err.message
                );
            }
        }
    } catch (err) {
        console.error(
            "Failed to send class session notifications:",
            err.message
        );
    }
};

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


    // Resolve timetable slot (auto-link unless explicitly provided)
    let resolvedTimetableId = timetableId
        ? Number(timetableId)
        : null;

    if (!resolvedTimetableId) {
        try {
            resolvedTimetableId =
                await resolveTimetableForSession({
                    courseOfferingId,
                    sectionId,
                    teacherId,
                    date,
                    startTime,
                    endTime,
                    room
                });
        } catch (err) {
            console.error(
                "Failed to resolve timetable for new class session:",
                err.message
            );
        }
    }


    // Create class session
    const session = await prisma.classSession.create({
        data: {
            courseOfferingId: Number(courseOfferingId),
            sectionId: sectionId
                ? Number(sectionId)
                : null,
            teacherId: Number(teacherId),
            timetableId: resolvedTimetableId,
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

    await notifyClassParticipants({
        courseOfferingId,
        teacherUserId: teacher.userId,
        type: "CLASS_REMINDER",
        title: "New class scheduled",
        message: `New class scheduled: ${describeSession(session)}`
    });

    return session;
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


    // Auto-resolve the timetable slot from the final schedule values when
    // the admin did not explicitly pick one, so edited sessions stay in sync
    // with the class routine
    let activeTimetableId = finalTimetableId;

    if (timetableId === undefined) {
        try {
            activeTimetableId =
                await resolveTimetableForSession({
                    courseOfferingId: finalCourseOfferingId,
                    sectionId: finalSectionId,
                    teacherId: finalTeacherId,
                    date: finalDate,
                    startTime: finalStartTime,
                    endTime: finalEndTime,
                    room
                }) || finalTimetableId;
        } catch (err) {
            console.error(
                "Failed to resolve timetable for updated class session:",
                err.message
            );
        }
    }


    // Update
    const session = await prisma.classSession.update({
        where: {
            id: Number(id)
        },

        data: {
            courseOfferingId: finalCourseOfferingId,
            sectionId: finalSectionId,
            teacherId: finalTeacherId,
            timetableId: activeTimetableId,
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

    const scheduleChanged =
        finalDate.getTime() !==
            new Date(existingSession.date).getTime() ||
        finalStartTime.getTime() !==
            new Date(existingSession.startTime).getTime() ||
        finalEndTime.getTime() !==
            new Date(existingSession.endTime).getTime();

    if (scheduleChanged) {
        await notifyClassParticipants({
            courseOfferingId: finalCourseOfferingId,
            teacherUserId: teacher.userId,
            type: "CLASS_RESCHEDULED",
            title: "Class updated",
            message: `Class updated: ${describeSession(session)}`
        });
    }

    return session;
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

    const session = await prisma.classSession.update({
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

    await notifyClassParticipants({
        courseOfferingId: existingSession.courseOfferingId,
        teacherUserId: session.teacher?.userId ||
            existingSession.teacherId,
        type: "CLASS_CANCELLED",
        title: "Class cancelled",
        message: `Class cancelled: ${describeSession(session)}`
    });

    return session;
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
    if (originalSession.status === "FINISHED") {
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


    // Auto-link the new session to its recurring timetable slot unless the
    // admin explicitly picked one
    let resolvedTimetableId = finalTimetableId;

    if (timetableId === undefined) {
        try {
            resolvedTimetableId =
                await resolveTimetableForSession({
                    courseOfferingId:
                        originalSession.courseOfferingId,
                    sectionId: finalSectionId,
                    teacherId: finalTeacherId,
                    date,
                    startTime,
                    endTime,
                    room
                }) || finalTimetableId;
        } catch (err) {
            console.error(
                "Failed to resolve timetable for rescheduled class session:",
                err.message
            );
        }
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

                    timetableId: resolvedTimetableId,

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
    }).then(async (result) => {
        try {
            await notifyClassParticipants({
                courseOfferingId:
                    originalSession.courseOfferingId,
                teacherUserId:
                    result.newSession.teacher?.userId ||
                    finalTeacherId,
                type: "CLASS_RESCHEDULED",
                title: "Class rescheduled",
                message:
                    `Class rescheduled from ${describeSession(originalSession)} ` +
                    `New time: ${describeSession(result.newSession)}`
            });
        } catch (err) {
            console.error(
                "Failed to send reschedule notification:",
                err.message
            );
        }

        return result;
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
      
