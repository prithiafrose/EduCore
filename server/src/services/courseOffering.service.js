const prisma = require("../config/prisma");


// GET all course offerings
const getAllCourseOfferings = async () => {
    return await prisma.courseOffering.findMany({
        include: {
            course: true,
            academicSemester: {
                include: {
                    program: true
                }
            }
        },
        orderBy: {
            id: "asc"
        }
    });
};


// GET course offering by ID
const getCourseOfferingById = async (id) => {
    return await prisma.courseOffering.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            course: true,
            academicSemester: {
                include: {
                    program: true
                }
            }
        }
    });
};


// CREATE course offering
const createCourseOffering = async (
    courseId,
    academicSemesterId
) => {
    return await prisma.courseOffering.create({
        data: {
            courseId: Number(courseId),
            academicSemesterId: Number(academicSemesterId)
        },
        include: {
            course: true,
            academicSemester: {
                include: {
                    program: true
                }
            }
        }
    });
};


// UPDATE course offering
const updateCourseOffering = async (
    id,
    courseId,
    academicSemesterId
) => {
    return await prisma.courseOffering.update({
        where: {
            id: Number(id)
        },
        data: {
            courseId: Number(courseId),
            academicSemesterId: Number(academicSemesterId)
        },
        include: {
            course: true,
            academicSemester: {
                include: {
                    program: true
                }
            }
        }
    });
};


// DELETE course offering
const deleteCourseOffering = async (id) => {
    return await prisma.courseOffering.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllCourseOfferings,
    getCourseOfferingById,
    createCourseOffering,
    updateCourseOffering,
    deleteCourseOffering
};