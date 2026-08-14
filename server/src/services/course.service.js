const prisma = require("../config/prisma");


// GET all courses
const getAllCourses = async () => {
    return await prisma.course.findMany({
        orderBy: {
            id: "asc"
        }
    });
};


// GET course by ID
const getCourseById = async (id) => {
    return await prisma.course.findUnique({
        where: {
            id: Number(id)
        }
    });
};


// CREATE course
const createCourse = async (
    code,
    name,
    credit,
    description
) => {
    return await prisma.course.create({
        data: {
            code: code.trim(),
            name: name.trim(),
            credit,
            description:
                description !== undefined &&
                description !== null &&
                description.trim() !== ""
                    ? description.trim()
                    : null
        }
    });
};


// UPDATE course
const updateCourse = async (
    id,
    code,
    name,
    credit,
    description
) => {
    return await prisma.course.update({
        where: {
            id: Number(id)
        },
        data: {
            code: code.trim(),
            name: name.trim(),
            credit,
            description:
                description !== undefined &&
                description !== null &&
                description.trim() !== ""
                    ? description.trim()
                    : null
        }
    });
};


// DELETE course
const deleteCourse = async (id) => {
    return await prisma.course.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};