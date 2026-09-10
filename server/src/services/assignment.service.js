const prisma = require("../config/prisma");
const notificationService = require("./notification.service");

const createAssignment = async (data) => {
  const {
    courseOfferingId,
    teacherId,
    title,
    description,
    deadline,
    attachmentPath,
    attachmentName,
    attachmentType,
    attachmentSize,
  } = data;

  const courseOffering = await prisma.courseOffering.findUnique({
    where: { id: Number(courseOfferingId) },
  });

  if (!courseOffering) {
    throw new Error("Course offering not found");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(teacherId) },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  if (!title || !title.trim()) {
    throw new Error("Title is required");
  }

  if (!deadline) {
    throw new Error("Deadline is required");
  }

  if (new Date(deadline) <= new Date()) {
    throw new Error("Deadline must be in the future");
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseOfferingId: Number(courseOfferingId),
      teacherId: Number(teacherId),
      title,
      description,
      deadline: new Date(deadline),
      attachmentPath: attachmentPath || null,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null,
      attachmentSize: attachmentSize || null,
    },
  });

  // Notify enrolled students about the new assignment
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseOfferingId: Number(courseOfferingId),
      },
      select: {
        student: {
          select: { userId: true },
        },
      },
    });

    await Promise.all(
      enrollments
        .map((enrollment) => enrollment.student?.userId)
        .filter(Boolean)
        .map((userId) =>
          notificationService.createNotification({
            userId,
            type: "ASSIGNMENT",
            title: "New assignment posted",
            message: `New assignment "${title}" has been posted. Deadline: ${new Date(
              deadline
            ).toLocaleDateString()}.`,
          })
        )
    );
  } catch (error) {
    console.error(
      "Failed to send assignment notifications:",
      error
    );
  }

  return assignment;
};

const getAllAssignments = async () => {
  return await prisma.assignment.findMany({
    include: {
      courseOffering: {
        include: {
          course: true,
          academicSemester: true,
        },
      },
      teacher: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAssignmentById = async (id) => {
  return await prisma.assignment.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      courseOffering: {
        include: {
          course: true,
          academicSemester: true,
        },
      },
      teacher: true,
      submissions: true,
      assessmentActivities: true,
    },
  });
};

const getAssignmentsByCourseOffering = async (courseOfferingId) => {
  return await prisma.assignment.findMany({
    where: {
      courseOfferingId: Number(courseOfferingId),
    },
    include: {
      teacher: true,
      submissions: true,
      assessmentActivities: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateAssignment = async (id, data) => {
  const assignment = await prisma.assignment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const updateData = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.deadline !== undefined) {
    updateData.deadline = new Date(data.deadline);
  }

  if (data.attachmentPath !== undefined) {
    updateData.attachmentPath = data.attachmentPath;
  }

  if (data.attachmentName !== undefined) {
    updateData.attachmentName = data.attachmentName;
  }

  if (data.attachmentType !== undefined) {
    updateData.attachmentType = data.attachmentType;
  }

  if (data.attachmentSize !== undefined) {
    updateData.attachmentSize = data.attachmentSize;
  }

  return await prisma.assignment.update({
    where: {
      id: Number(id),
    },
    data: updateData,
  });
};

const deleteAssignment = async (id) => {
  const assignment = await prisma.assignment.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return await prisma.assignment.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourseOffering,
  updateAssignment,
  deleteAssignment,
};