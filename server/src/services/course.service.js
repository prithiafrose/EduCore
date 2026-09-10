const prisma = require("../config/prisma");

const prerequisiteSelect = {
    select: {
        id: true,
        code: true,
        name: true,
        credit: true
    }
};


// GET all courses
const getAllCourses = async () => {
    return await prisma.course.findMany({
        include: {
            prerequisites: prerequisiteSelect,
            prerequisitesFor: prerequisiteSelect
        },
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
        },
        include: {
            prerequisites: prerequisiteSelect,
            prerequisitesFor: prerequisiteSelect
        }
    });
};


// CREATE course
const createCourse = async (
    code,
    name,
    credit,
    description,
    prerequisites
) => {
    const prerequisiteIds =
        Array.isArray(prerequisites)
            ? prerequisites
                .map(Number)
                .filter(
                    (id) =>
                        Number.isInteger(id) && id > 0
                )
            : [];

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
                    : null,
            ...(prerequisiteIds.length > 0 && {
                prerequisites: {
                    connect: prerequisiteIds.map(
                        (id) => ({ id })
                    )
                }
            })
        },
        include: {
            prerequisites: prerequisiteSelect,
            prerequisitesFor: prerequisiteSelect
        }
    });
};


// UPDATE course
const updateCourse = async (
    id,
    code,
    name,
    credit,
    description,
    prerequisites
) => {
    const prerequisiteIds =
        Array.isArray(prerequisites)
            ? prerequisites
                .map(Number)
                .filter(
                    (id) =>
                        Number.isInteger(id) && id > 0
                )
            : null;

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
                    : null,
            ...(prerequisiteIds !== null && {
                prerequisites: {
                    set: prerequisiteIds.map(
                        (id) => ({ id })
                    )
                }
            })
        },
        include: {
            prerequisites: prerequisiteSelect,
            prerequisitesFor: prerequisiteSelect
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