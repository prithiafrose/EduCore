const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/hash");


// GET all teachers
const getAllTeachers = async () => {
    return await prisma.teacher.findMany({
        include: {
            department: true
        },
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
        },
        include: {
            department: true
        }
    });
};


// GET teacher by user ID
const getTeacherByUserId = async (userId) => {
    return await prisma.teacher.findUnique({
        where: {
            userId: Number(userId)
        },
        include: {
            department: true
        }
    });
};


// CREATE teacher
const createTeacher = async (
    name,
    email,
    employeeId,
    password,
    designation,
    departmentId
) => {

    return await prisma.$transaction(async (tx) => {

        // Create login account
        const user = await tx.user.create({
            data: {
                email,
                passwordHash: await hashPassword(password),
                role: "TEACHER"
            }
        });


        // Create teacher profile
        const teacher = await tx.teacher.create({
            data: {
                name,
                email,
                employeeId,
                designation: designation || null,
                departmentId:
                    departmentId !== undefined &&
                    departmentId !== null &&
                    departmentId !== ""
                        ? Number(departmentId)
                        : null,
                userId: user.id
            },
            include: {
                department: true
            }
        });


        return teacher;
    });
};


// UPDATE teacher
// Only name, email, employeeId, designation and department can be changed
const updateTeacher = async (
    id,
    name,
    email,
    employeeId,
    designation,
    departmentId
) => {

    return await prisma.teacher.update({
        where: {
            id: Number(id)
        },

        data: {
            name,
            email,
            employeeId,
            ...(designation !== undefined && {
                designation: designation || null
            }),
            ...(departmentId !== undefined && {
                departmentId:
                    departmentId !== null &&
                    departmentId !== ""
                        ? Number(departmentId)
                        : null
            })
        },
        include: {
            department: true
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
    getTeacherByUserId,
    createTeacher,
    updateTeacher,
    deleteTeacher
};