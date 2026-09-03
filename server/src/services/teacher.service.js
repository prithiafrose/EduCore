const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/hash");

const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        orderBy: { id: "asc" }
    });
};

const getTeacherById = async (id) => {
    return await prisma.teacher.findUnique({
        where: { id: Number(id) }
    });
};

const createTeacher = async (
    name,
    email,
    employeeId,
    password
) => {
    return await prisma.$transaction(async (tx) => {

        // Create the login account
        const user = await tx.user.create({
            data: {
                email,
                passwordHash: await hashPassword(password),
                role: "TEACHER"
            }
        });

        // Create the teacher profile
        const teacher = await tx.teacher.create({
            data: {
                name,
                email,
                employeeId,
                userId: user.id
            }
        });

        return teacher;
    });
};

const updateTeacher = async (
    id,
    name,
    email,
    employeeId,
    userId
) => {
    return await prisma.teacher.update({
        where: { id: Number(id) },
        data: {
            name,
            email,
            employeeId,
            userId: Number(userId)
        }
    });
};

const deleteTeacher = async (id) => {
    return await prisma.teacher.delete({
        where: { id: Number(id) }
    });
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};