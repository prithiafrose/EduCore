const prisma = require("../config/prisma");

// CREATE course material
const createCourseMaterial = async (data) => {
    const courseOffering = await prisma.courseOffering.findUnique({
        where: {
            id: Number(data.courseOfferingId)
        }
    });

    if (!courseOffering) {
        throw new Error("Course offering not found");
    }

    const teacher = await prisma.teacher.findUnique({
        where: {
            id: Number(data.teacherId)
        }
    });

    if (!teacher) {
        throw new Error("Teacher not found");
    }

    return prisma.courseMaterial.create({
        data: {
            courseOfferingId: Number(data.courseOfferingId),
            teacherId: Number(data.teacherId),
            title: data.title,
            description: data.description || null,
            fileName: data.fileName || null,
            filePath: data.filePath || null,
            fileType: data.fileType || null,
            fileSize: data.fileSize
                ? Number(data.fileSize)
                : null
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            teacher: true
        }
    });
};

// GET all course materials
const getAllCourseMaterials = async () => {
    return prisma.courseMaterial.findMany({
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            teacher: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

// GET materials by course offering
const getMaterialsByCourseOffering = async (courseOfferingId) => {
    return prisma.courseMaterial.findMany({
        where: {
            courseOfferingId: Number(courseOfferingId)
        },
        include: {
            courseOffering: {
                include: {
                    course: true,
                    academicSemester: true
                }
            },
            teacher: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};

// GET course material by ID
const getCourseMaterialById = async (id) => {
    return prisma.courseMaterial.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            courseOffering: true,
            teacher: true
        }
    });
};

// DELETE course material
const deleteCourseMaterial = async (id) => {
    const material = await prisma.courseMaterial.findUnique({
        where: {
            id: Number(id)
        }
    });

    if (!material) {
        throw new Error("Course material not found");
    }

    return prisma.courseMaterial.delete({
        where: {
            id: Number(id)
        }
    });
};

module.exports = {
    createCourseMaterial,
    getAllCourseMaterials,
    getMaterialsByCourseOffering,
    getCourseMaterialById,
    deleteCourseMaterial
};