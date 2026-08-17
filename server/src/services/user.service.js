const prisma = require("../config/prisma");


// GET all users
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};


// GET user by ID
const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};


// CREATE user
const createUser = async (
    email,
    passwordHash,
    role
) => {
    return await prisma.user.create({
        data: {
            email,
            passwordHash,
            role
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};


// UPDATE user
const updateUser = async (
    id,
    email,
    passwordHash,
    role
) => {
    return await prisma.user.update({
        where: {
            id: Number(id)
        },
        data: {
            email,
            passwordHash,
            role
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
        }
    });
};


// DELETE user
const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: {
            id: Number(id)
        }
    });
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};