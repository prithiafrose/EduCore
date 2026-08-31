const prisma = require("../config/prisma");

// Create student payment
const createStudentPayment = async (data) => {
  const { studentId, feeId, amount } = data;

  // Check student
  const student = await prisma.student.findUnique({
    where: {
      id: Number(studentId),
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Check fee
  const fee = await prisma.fee.findUnique({
    where: {
      id: Number(feeId),
    },
  });

  if (!fee) {
    throw new Error("Fee not found");
  }

  // Check duplicate payment
  const existingPayment = await prisma.studentPayment.findUnique({
    where: {
      studentId_feeId: {
        studentId: Number(studentId),
        feeId: Number(feeId),
      },
    },
  });

  if (existingPayment) {
    throw new Error("Student has already made a payment for this fee");
  }
  // Check student belongs to the fee's program
if (student.programId !== fee.programId) {
  throw new Error("Student does not belong to this fee's program");
}

  // Payment amount must match fee amount
  if (Number(amount) !== Number(fee.amount)) {
    throw new Error("Payment amount does not match the fee amount");
  }

  return prisma.studentPayment.create({
    data: {
      studentId: Number(studentId),
      feeId: Number(feeId),
      amount,
      status: "PENDING",
    },
    include: {
      student: true,
      fee: true,
    },
  });
};

// Get all student payments
const getAllStudentPayments = async () => {
  return prisma.studentPayment.findMany({
    include: {
      student: true,
      fee: true,
    },
  });
};

// Get payment by ID
const getStudentPaymentById = async (id) => {
  return prisma.studentPayment.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      student: true,
      fee: true,
    },
  });
};

// Get payments by student
const getPaymentsByStudent = async (studentId) => {
  return prisma.studentPayment.findMany({
    where: {
      studentId: Number(studentId),
    },
    include: {
      fee: true,
    },
  });
};

// Update payment status
const updatePaymentStatus = async (id, status) => {
  const payment = await prisma.studentPayment.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      fee: true,
    },
  });

  if (!payment) {
    throw new Error("Student payment not found");
  }

  const validStatuses = [
    "PENDING",
    "PAID",
    "FAILED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid payment status");
  }

  const updateData = {
    status,
  };

  if (status === "PAID") {
    updateData.paidAt = new Date();
  } else {
    updateData.paidAt = null;
  }

  return prisma.studentPayment.update({
    where: {
      id: Number(id),
    },
    data: updateData,
    include: {
      student: true,
      fee: true,
    },
  });
};

// Delete student payment
const deleteStudentPayment = async (id) => {
  const payment = await prisma.studentPayment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!payment) {
    throw new Error("Student payment not found");
  }

  return prisma.studentPayment.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  createStudentPayment,
  getAllStudentPayments,
  getStudentPaymentById,
  getPaymentsByStudent,
  updatePaymentStatus,
  deleteStudentPayment,
};