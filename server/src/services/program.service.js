const prisma = require("../config/prisma");


// GET all programs
const getAllPrograms = async () => {
    return await prisma.program.findMany({
        include: {
            department: true
        }
    });
};


// GET program by ID
const getProgramById = async (id) => {
    return await prisma.program.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            department: true
        }
    });
};


// CREATE program
const createProgram = async (
    name,
    code,
        programType,

    durationYears,
      totalSemesters,
    departmentId
) => {
    return await prisma.program.create({
        data: {
            name: name.trim(),
            code: code.trim(),
                programType,

            durationYears,
            totalSemesters,
            departmentId: Number(departmentId)
        }
    });
};


// UPDATE program
const updateProgram = async (
    id,
    name,
    code,
        programType,

    durationYears,
      totalSemesters,
    departmentId
) => {
    return await prisma.program.update({
        where: {
            id: Number(id)
        },
        data: {
            name: name.trim(),
            code: code.trim(),
                programType,

            durationYears,
            totalSemesters,
            departmentId: Number(departmentId)
        }
    });
};


// DELETE program
const deleteProgram = async (id) => {
    return await prisma.program.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
};