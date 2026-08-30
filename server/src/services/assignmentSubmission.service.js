const prisma = require("../config/prisma");

const createAssignmentSubmission = async (data) => {
  const { assignmentId, studentId, fileUrl } = data;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const existingSubmission =
    await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
    });

  if (existingSubmission) {
    throw new Error(
      "Student has already submitted this assignment"
    );
  }

  return await prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId,
      fileUrl,
      submittedAt: new Date(),
    },
  });
};

const getSubmissionById = async (id) => {
  return await prisma.assignmentSubmission.findUnique({
    where: { id },
    include: {
      assignment: true,
      student: true,
    },
  });
};

const getSubmissionsByAssignment = async (assignmentId) => {
  return await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSubmissionsByStudent = async (studentId) => {
  return await prisma.assignmentSubmission.findMany({
    where: { studentId },
    include: {
      assignment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateSubmission = async (id, data) => {
  const submission =
    await prisma.assignmentSubmission.findUnique({
      where: { id },
    });

  if (!submission) {
    throw new Error("Submission not found");
  }

  return await prisma.assignmentSubmission.update({
    where: { id },
    data: {
      marks: data.marks,
      feedback: data.feedback,
    },
  });
};

const deleteSubmission = async (id) => {
  const submission =
    await prisma.assignmentSubmission.findUnique({
      where: { id },
    });

  if (!submission) {
    throw new Error("Submission not found");
  }

  return await prisma.assignmentSubmission.delete({
    where: { id },
  });
};

module.exports = {
  createAssignmentSubmission,
  getSubmissionById,
  getSubmissionsByAssignment,
  getSubmissionsByStudent,
  updateSubmission,
  deleteSubmission,
};