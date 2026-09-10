const prisma = require("../config/prisma");
const notificationService = require("./notification.service");

const createAssignmentSubmission = async (data) => {
  const {
    assignmentId,
    studentId,
    fileUrl,
    fileName,
    fileType,
    fileSize,
    note,
  } = data;

  const assignment = await prisma.assignment.findUnique({
    where: { id: Number(assignmentId) },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const hasFile = fileUrl && fileUrl.trim();
  const hasNote = note && note.trim();

  if (!hasFile && !hasNote) {
    throw new Error(
      "Please provide a file or a note for your submission"
    );
  }

  if (new Date() > new Date(assignment.deadline)) {
    throw new Error("The deadline for this assignment has passed");
  }

  const existingSubmission =
    await prisma.assignmentSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: Number(assignmentId),
          studentId: Number(studentId),
        },
      },
    });

  if (existingSubmission) {
    if (existingSubmission.marks !== null) {
      throw new Error(
        "This assignment has already been graded and can no longer be resubmitted"
      );
    }

    return await prisma.assignmentSubmission.update({
      where: {
        id: existingSubmission.id,
      },
      data: {
        ...(hasFile
          ? {
              fileUrl,
              fileName,
              fileType,
              fileSize: fileSize || null,
            }
          : {}),
        ...(hasNote
          ? { note: note.trim() }
          : {}),
        submittedAt: new Date(),
      },
    });
  }

  return await prisma.assignmentSubmission.create({
    data: {
      assignmentId: Number(assignmentId),
      studentId: Number(studentId),
      fileUrl: hasFile ? fileUrl : null,
      fileName: hasFile ? fileName : null,
      fileType: hasFile ? fileType : null,
      fileSize: hasFile ? (fileSize || null) : null,
      note: hasNote ? note.trim() : null,
      submittedAt: new Date(),
    },
  });
};

const getSubmissionById = async (id) => {
  return await prisma.assignmentSubmission.findUnique({
    where: { id: Number(id) },
    include: {
      assignment: true,
      student: true,
    },
  });
};

const getSubmissionsByAssignment = async (assignmentId) => {
  return await prisma.assignmentSubmission.findMany({
    where: { assignmentId: Number(assignmentId) },
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
    where: { studentId: Number(studentId) },
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
      where: { id: Number(id) },
      include: {
        assignment: true,
        student: true,
      },
    });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const updateData = {};

  if (data.marks !== undefined && data.marks !== null) {
    const parsedMarks = Number(data.marks);

    if (
      Number.isNaN(parsedMarks) ||
      parsedMarks < 0
    ) {
      throw new Error(
        "Marks must be a non-negative number"
      );
    }

    updateData.marks = parsedMarks;
  }

  if (data.feedback !== undefined) {
    updateData.feedback = data.feedback || null;
  }

  const graded = await prisma.assignmentSubmission.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      assignment: true,
    },
  });

  // Notify the student that their work has been graded
  if (
    graded.marks !== null &&
    submission.student?.userId
  ) {
    try {
      await notificationService.createNotification({
        userId: submission.student.userId,
        type: "ASSIGNMENT",
        title: "Assignment graded",
        message: `Your submission for "${
          submission.assignment.title
        }" has been graded with ${
          graded.marks
        } marks.`,
      });
    } catch (error) {
      console.error(
        "Failed to send grading notification:",
        error
      );
    }
  }

  return graded;
};

const deleteSubmission = async (id) => {
  const submission =
    await prisma.assignmentSubmission.findUnique({
      where: { id: Number(id) },
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