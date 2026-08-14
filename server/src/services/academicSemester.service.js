const prisma = require("../config/prisma");


// GET all academic semesters
const getAllAcademicSemesters = async () => {
    return await prisma.academicSemester.findMany({
        include: {
            program: true
        },
        orderBy: [
            {
                programId: "asc"
            },
            {
                order: "asc"
            }
        ]
    });
};


// GET academic semester by ID
const getAcademicSemesterById = async (id) => {
    return await prisma.academicSemester.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            program: true
        }
    });
};


// CREATE academic semester
const createAcademicSemester = async (
    name,
    order,
    programId
) => {
    return await prisma.academicSemester.create({
        data: {
            name: name.trim(),
            order: Number(order),
            programId: Number(programId)
        },
        include: {
            program: true
        }
    });
};


// UPDATE academic semester
const updateAcademicSemester = async (
    id,
    name,
    order,
    programId
) => {
    return await prisma.academicSemester.update({
        where: {
            id: Number(id)
        },
        data: {
            name: name.trim(),
            order: Number(order),
            programId: Number(programId)
        },
        include: {
            program: true
        }
    });
};


// DELETE academic semester
const deleteAcademicSemester = async (id) => {
    return await prisma.academicSemester.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllAcademicSemesters,
    getAcademicSemesterById,
    createAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester
};