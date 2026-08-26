const prisma = require("../config/prisma");

// Create Exam
const createExam = async (data) => {
  const {
    courseOfferingId,
    type,
    maxMarks,
    date,
    startTime,
    endTime,
    room,
  } = data;

  // Check course offering
  const courseOffering = await prisma.courseOffering.findUnique({
    where: {
      id: Number(courseOfferingId),
    },
  });

  if (!courseOffering) {
    throw new Error("Course offering not found");
  }

  // Validate max marks
  if (Number(maxMarks) <= 0) {
    throw new Error("Maximum marks must be greater than 0");
  }

  // Validate exam time
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    throw new Error("End time must be after start time");
  }

  const exam = await prisma.exam.create({
    data: {
      courseOfferingId: Number(courseOfferingId),
      type,
      maxMarks,
      date: new Date(date),
      startTime: start,
      endTime: end,
      room: room || null,
    },
  });

  return exam;
};

// Get All Exams
const getAllExams = async () => {
  return await prisma.exam.findMany({
    include: {
      courseOffering: true,
      examMarks: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

// Get Exam By ID
const getExamById = async (id) => {
  const exam = await prisma.exam.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      courseOffering: true,
      examMarks: true,
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  return exam;
};

// Update Exam
const updateExam = async (id, data) => {
  const exam = await prisma.exam.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  if (data.maxMarks !== undefined && Number(data.maxMarks) <= 0) {
    throw new Error("Maximum marks must be greater than 0");
  }

  const updateData = {};

  if (data.courseOfferingId !== undefined) {
    updateData.courseOfferingId = Number(data.courseOfferingId);
  }

  if (data.type !== undefined) {
    updateData.type = data.type;
  }

  if (data.maxMarks !== undefined) {
    updateData.maxMarks = data.maxMarks;
  }

  if (data.date !== undefined) {
    updateData.date = new Date(data.date);
  }

  if (data.startTime !== undefined) {
    updateData.startTime = new Date(data.startTime);
  }

  if (data.endTime !== undefined) {
    updateData.endTime = new Date(data.endTime);
  }

  if (data.room !== undefined) {
    updateData.room = data.room;
  }

  return await prisma.exam.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

// Delete Exam
const deleteExam = async (id) => {
  const exam = await prisma.exam.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!exam) {
    throw new Error("Exam not found");
  }

  // Delete related exam marks first
  await prisma.examMark.deleteMany({
    where: {
      examId: Number(id),
    },
  });

  await prisma.exam.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    message: "Exam deleted successfully",
  };
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};