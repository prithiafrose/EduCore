const prisma = require("../config/prisma");


// GET all users
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
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
            isActive: true,
            createdAt: true
        }
    });
};


// CREATE user
const { hashPassword } = require("../utils/hash");

const createUser = async (email, password, role, isActive = true) => {
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      role,
      isActive,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};


// UPDATE user
const updateUser = async (id, email, password, role, isActive) => {
  const updateData = {
    email,
    role,
  };

  // Only hash if a new password is provided
  if (password) {
    updateData.passwordHash = await hashPassword(password);
  }

  // Only apply isActive when explicitly provided
  if (isActive !== undefined && isActive !== null) {
    updateData.isActive = Boolean(isActive);
  }

  return await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: updateData,
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
};


// Toggle user active status
const setUserActive = async (id, isActive) => {
  return await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      isActive: Boolean(isActive),
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
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
    deleteUser,
    setUserActive
};