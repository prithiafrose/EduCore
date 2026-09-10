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


// GET student by user ID
const getStudentByUserId = async (userId) => {
    return await prisma.student.findFirst({
        where: {
            userId: Number(userId)
        },
        include: {
            program: true,
            user: true
        }
    });
};


// CREATE student
const { hashPassword } = require("../utils/hash");

const createStudent = async (
  studentId,
  name,
  email,
  programId,
  password,
  dateOfBirth,
  guardianName,
  guardianPhone
) => {

  return await prisma.$transaction(async (tx) => {

    // Create login account
    const user = await tx.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        role: "STUDENT",
      },
    });

    // Create student profile
    const student = await tx.student.create({
      data: {
        studentId,
        name,
        email,
        programId: Number(programId),
        userId: user.id,
        dateOfBirth:
          dateOfBirth && dateOfBirth !== ""
            ? new Date(dateOfBirth)
            : null,
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
      },
      include: {
        program: true,
        user: true,
      },
    });

    return student;

  });

};


const updateStudent = async (
    id,
    studentId,
    name,
    email,
    programId,
    dateOfBirth,
    guardianName,
    guardianPhone
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
            ...(dateOfBirth !== undefined && {
                dateOfBirth:
                    dateOfBirth !== null &&
                    dateOfBirth !== ""
                        ? new Date(dateOfBirth)
                        : null
            }),
            ...(guardianName !== undefined && {
                guardianName: guardianName || null
            }),
            ...(guardianPhone !== undefined && {
                guardianPhone: guardianPhone || null
            })
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
    getStudentByUserId,
    createStudent,
    updateStudent,
    deleteStudent
};