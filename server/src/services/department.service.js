const prisma = require("../config/prisma");


// Get all departments
const getAllDepartments = async () => {
    return await prisma.department.findMany({
        orderBy: {
            id: "asc"
        }
    });
};


// Get department by ID
const getDepartmentById = async (id) => {
    return await prisma.department.findUnique({
        where: {
            id: Number(id)
        }
    });
};


// Create department
const createDepartment = async (name, code) => {
    return await prisma.department.create({
        data: {
            name: name.trim(),
            code: code.trim()
        }
    });
};


// Update department
const updateDepartment = async (id, name, code) => {
    return await prisma.department.update({
        where: {
            id: Number(id)
        },
        data: {
            name: name.trim(),
            code: code.trim()
        }
    });
};


// Delete department
const deleteDepartment = async (id) => {

    const department = await prisma.department.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            programs: true
        }
    });

    if (!department) {
        return {
            notFound: true
        };
    }

    if (department.programs.length > 0) {
        return {
            hasPrograms: true
        };
    }

    await prisma.department.delete({
        where: {
            id: Number(id)
        }
    });

    return {
        deleted: true
    };
};


module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};