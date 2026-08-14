const prisma = require("../config/prisma");


// GET all sections
const getAllSections = async () => {
    return await prisma.section.findMany({
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            }
        },
        orderBy: {
            id: "asc"
        }
    });
};


// GET section by ID
const getSectionById = async (id) => {
    return await prisma.section.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            }
        }
    });
};


// CREATE section
const createSection = async (
    name,
    courseOfferingId
) => {
    return await prisma.section.create({
        data: {
            name,
            courseOfferingId: Number(courseOfferingId)
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            }
        }
    });
};


// UPDATE section
const updateSection = async (
    id,
    name,
    courseOfferingId
) => {
    return await prisma.section.update({
        where: {
            id: Number(id)
        },
        data: {
            name,
            courseOfferingId: Number(courseOfferingId)
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            }
        }
    });
};


// DELETE section
const deleteSection = async (id) => {
    return await prisma.section.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
};