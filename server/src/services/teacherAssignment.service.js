const prisma = require("../config/prisma");


// GET all teacher assignments
const getAllTeacherAssignments = async () => {
    return await prisma.teacherAssignment.findMany({
        include: {
            teacher: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        },
        orderBy: {
            id: "asc"
        }
    });
};


// GET teacher assignment by ID
const getTeacherAssignmentById = async (id) => {
    return await prisma.teacherAssignment.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            teacher: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};
// GET assignments by teacher
const getTeacherAssignmentsByTeacher = async (
    teacherId
) => {

    return await prisma.teacherAssignment.findMany({

        where: {
            teacherId: Number(teacherId)
        },

        include: {

            teacher: true,

            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },

            section: true

        },

        orderBy: {
            id: "asc"
        }

    });

};

// CREATE teacher assignment
const createTeacherAssignment = async (
    teacherId,
    courseOfferingId,
    sectionId
) => {
    return await prisma.teacherAssignment.create({
        data: {
            teacherId: Number(teacherId),
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null || sectionId === undefined
                    ? null
                    : Number(sectionId)
        },
        include: {
            teacher: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};


// UPDATE teacher assignment
const updateTeacherAssignment = async (
    id,
    teacherId,
    courseOfferingId,
    sectionId
) => {
    return await prisma.teacherAssignment.update({
        where: {
            id: Number(id)
        },
        data: {
            teacherId: Number(teacherId),
            courseOfferingId: Number(courseOfferingId),
            sectionId:
                sectionId === null || sectionId === undefined
                    ? null
                    : Number(sectionId)
        },
        include: {
            teacher: true,
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            section: true
        }
    });
};


// DELETE teacher assignment
const deleteTeacherAssignment = async (id) => {
    return await prisma.teacherAssignment.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllTeacherAssignments,
    getTeacherAssignmentById,
        getTeacherAssignmentsByTeacher,

    createTeacherAssignment,
    updateTeacherAssignment,
    deleteTeacherAssignment
};