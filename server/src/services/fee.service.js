const prisma = require("../config/prisma");

// Create Fee
const createFee = async (data) => {
  const {
    programId,
    academicSemesterId,
    type,
    amount,
    dueDate,
    description,
  } = data;

  // Check program
  const program = await prisma.program.findUnique({
    where: { id: Number(programId) },
  });

  if (!program) {
    throw new Error("Program not found");
  }

  // Check academic semester
  const semester = await prisma.academicSemester.findUnique({
    where: { id: Number(academicSemesterId) },
  });

  if (!semester) {
    throw new Error("Academic semester not found");
  }
// Check academic semester belongs to the program
if (semester.programId !== Number(programId)) {
  throw new Error(
    "Academic semester does not belong to this program"
  );
}
  // Check duplicate fee
  const existingFee = await prisma.fee.findUnique({
    where: {
      programId_academicSemesterId_type: {
        programId: Number(programId),
        academicSemesterId: Number(academicSemesterId),
        type,
      },
    },
  });

  if (existingFee) {
    throw new Error(
      "This fee already exists for this program and semester"
    );
  }

  return prisma.fee.create({
    data: {
      programId: Number(programId),
      academicSemesterId: Number(academicSemesterId),
      type,
      amount,
      dueDate: new Date(dueDate),
      description,
    },
    include: {
      program: true,
      academicSemester: true,
    },
  });
};

// Get all Fees
const getAllFees = async () => {
  return prisma.fee.findMany({
    include: {
      program: true,
      academicSemester: true,
      payments: true,
    },
  });
};

// Get Fee by ID
const getFeeById = async (id) => {
  return prisma.fee.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      program: true,
      academicSemester: true,
      payments: true,
    },
  });
};

// Get Fees by Program
const getFeesByProgram = async (programId) => {
  return prisma.fee.findMany({
    where: {
      programId: Number(programId),
    },
    include: {
      academicSemester: true,
    },
  });
};

// Get Fees by Semester
const getFeesBySemester = async (academicSemesterId) => {
  return prisma.fee.findMany({
    where: {
      academicSemesterId: Number(academicSemesterId),
    },
    include: {
      program: true,
    },
  });
};

// Update Fee
const updateFee = async (id, data) => {
  const existingFee = await prisma.fee.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!existingFee) {
    throw new Error("Fee not found");
  }

  const updateData = {};

  if (data.amount !== undefined) {
    updateData.amount = data.amount;
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate = new Date(data.dueDate);
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  return prisma.fee.update({
    where: {
      id: Number(id),
    },
    data: updateData,
    include: {
      program: true,
      academicSemester: true,
    },
  });
};

// Delete Fee
const deleteFee = async (id) => {
  const existingFee = await prisma.fee.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!existingFee) {
    throw new Error("Fee not found");
  }

  return prisma.fee.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  createFee,
  getAllFees,
  getFeeById,
  getFeesByProgram,
  getFeesBySemester,
  updateFee,
  deleteFee,
};