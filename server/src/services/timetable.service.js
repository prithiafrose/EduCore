const prisma = require("../config/prisma");


// GET all timetables
const getAllTimetables = async () => {
    return await prisma.timetable.findMany({
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true,
            teacherAssignment: {
                include: {
                    teacher: true
                }
            }
        },
        orderBy: {
            dayOfWeek: "asc"
        }
    });
};


// GET timetable by ID
const getTimetableById = async (id) => {
    return await prisma.timetable.findUnique({
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
            teacherAssignment: {
                include: {
                    teacher: true
                }
            }
        }
    });
};


// CREATE timetable
const createTimetable = async (
    courseOfferingId,
    sectionId,
    teacherAssignmentId,
    dayOfWeek,
    startTime,
    endTime,
    room
) => {
    return await prisma.timetable.create({
        data: {
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null
                    ? null
                    : Number(sectionId),
            teacherAssignmentId: Number(teacherAssignmentId),
            dayOfWeek: Number(dayOfWeek),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
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
            teacherAssignment: {
                include: {
                    teacher: true
                }
            }
        }
    });
};


// UPDATE timetable
const updateTimetable = async (
    id,
    courseOfferingId,
    sectionId,
    teacherAssignmentId,
    dayOfWeek,
    startTime,
    endTime,
    room
) => {
    return await prisma.timetable.update({
        where: {
            id: Number(id)
        },
        data: {
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null
                    ? null
                    : Number(sectionId),
            teacherAssignmentId: Number(teacherAssignmentId),
            dayOfWeek: Number(dayOfWeek),
            startTime: new Date(startTime),
            endTime: new Date(endTime),
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
            teacherAssignment: {
                include: {
                    teacher: true
                }
            }
        }
    });
};


// DELETE timetable
const deleteTimetable = async (id) => {
    return await prisma.timetable.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllTimetables,
    getTimetableById,
    createTimetable,
    updateTimetable,
    deleteTimetable
};