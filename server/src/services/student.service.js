const prisma = require("../config/prisma");


// GET all students
const getAllStudents = async () => {
    return await prisma.student.findMany({
        include: {
            program: true,
            user: true
        }
    });
};


// GET student by ID
const getStudentById = async (id) => {
    return await prisma.student.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            program: true,
            user: true
        }
    });
};


// CREATE student
const createStudent = async (
    studentId,
    name,
    email,
    programId,
    userId
) => {
    return await prisma.student.create({
        data: {
            studentId,
            name,
            email,
            programId: Number(programId),
            userId: Number(userId)
        },
        include: {
            program: true,
            user: true
        }
    });
};


// UPDATE student
const updateStudent = async (
    id,
    studentId,
    name,
    email,
    programId,
    userId
) => {
    return await prisma.student.update({
        where: {
            id: Number(id)
        },
        data: {
            studentId,
            name,
            email,
            programId: Number(programId),
            userId: Number(userId)
        },
        include: {
            program: true,
            user: true
        }
    });
};


// DELETE student
const deleteStudent = async (id) => {
    return await prisma.student.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};