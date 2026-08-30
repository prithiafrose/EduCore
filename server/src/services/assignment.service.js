const prisma = require("../config/prisma");

const createAssignment = async (data) => {
  const {
    courseOfferingId,
    teacherId,
    title,
    description,
    deadline,
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

  return await prisma.assignment.create({
    data: {
      courseOfferingId: Number(courseOfferingId),
      teacherId: Number(teacherId),
      title,
      description,
      deadline: new Date(deadline),
    },
  });
};

const getAllAssignments = async () => {
  return await prisma.assignment.findMany({
    include: {
      courseOffering: true,
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
      courseOffering: true,
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