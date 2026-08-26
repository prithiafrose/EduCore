const prisma = require("../config/prisma");

// Create Exam Mark
const createExamMark = async (data) => {
  const { examId, enrollmentId, marks } = data;

  // Check exam
  const exam = await prisma.exam.findUnique({
    where: {
      id: Number(examId),
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      id: Number(enrollmentId),
    },
  });

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const obtainedMarks = Number(marks);
  const maximumMarks = Number(exam.maxMarks);

  // Validate marks
  if (obtainedMarks < 0) {
    throw new Error("Marks cannot be negative");
  }

  if (obtainedMarks > maximumMarks) {
    throw new Error(
      `Marks cannot be greater than ${maximumMarks}`
    );
  }

  // Check duplicate
  const existingMark = await prisma.examMark.findUnique({
    where: {
      examId_enrollmentId: {
        examId: Number(examId),
        enrollmentId: Number(enrollmentId),
      },
    },
  });

  if (existingMark) {
    throw new Error("Exam mark already exists for this student");
  }

  const examMark = await prisma.examMark.create({
    data: {
      examId: Number(examId),
      enrollmentId: Number(enrollmentId),
      marks: obtainedMarks,
    },
  });

  return examMark;
};


// Get All Exam Marks
const getAllExamMarks = async () => {
  return await prisma.examMark.findMany({
    include: {
      exam: true,
      enrollment: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};


// Get Exam Mark By ID
const getExamMarkById = async (id) => {
  const examMark = await prisma.examMark.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      exam: true,
      enrollment: true,
    },
  });

  if (!examMark) {
    throw new Error("Exam mark not found");
  }

  return examMark;
};


// Update Exam Mark
const updateExamMark = async (id, data) => {
  const examMark = await prisma.examMark.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      exam: true,
    },
  });

  if (!examMark) {
    throw new Error("Exam mark not found");
  }

  const updateData = {};

  if (data.marks !== undefined) {
    const obtainedMarks = Number(data.marks);
    const maximumMarks = Number(examMark.exam.maxMarks);

    if (obtainedMarks < 0) {
      throw new Error("Marks cannot be negative");
    }

    if (obtainedMarks > maximumMarks) {
      throw new Error(
        `Marks cannot be greater than ${maximumMarks}`
      );
    }

    updateData.marks = obtainedMarks;
  }

  return await prisma.examMark.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};


// Delete Exam Mark
const deleteExamMark = async (id) => {
  const examMark = await prisma.examMark.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!examMark) {
    throw new Error("Exam mark not found");
  }

  await prisma.examMark.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Exam mark deleted successfully",
  };
};





module.exports = {
  createExamMark,
  getAllExamMarks,
  getExamMarkById,
  updateExamMark,
  deleteExamMark
};