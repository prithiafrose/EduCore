const prisma = require("../config/prisma");


// GET all teachers
const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        orderBy: {
            id: "asc"
        }
    });
};


// GET teacher by ID
const getTeacherById = async (id) => {
    return await prisma.teacher.findUnique({
        where: {
            id: Number(id)
        }
    });
};


// CREATE teacher
const createTeacher = async (
    name,
    email,
    employeeId,
    userId
) => {
    return await prisma.teacher.create({
        data: {
            name,
            email,
            employeeId,
            userId: Number(userId)
        }
    });
};

// UPDATE teacher
const updateTeacher = async (
    id,
    name,
    email,
    employeeId,
    userId
) => {
    return await prisma.teacher.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            email,
            employeeId,
            userId: Number(userId)
        }
    });
};


// DELETE teacher
const deleteTeacher = async (id) => {
    return await prisma.teacher.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};