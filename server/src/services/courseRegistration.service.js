const prisma = require("../config/prisma");

// Create Course Registration
const createCourseRegistration = async (data) => {
  const { studentId, academicSemesterId, courseOfferingIds } = data;

  // Check student exists
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Check semester exists
  const semester = await prisma.academicSemester.findUnique({
    where: { id: Number(academicSemesterId) },
  });

  if (!semester) {
    throw new Error("Academic semester not found");
  }

  // Prevent duplicate registration
  const existing = await prisma.courseRegistration.findUnique({
    where: {
      studentId_academicSemesterId: {
        studentId: Number(studentId),
        academicSemesterId: Number(academicSemesterId),
      },
    },
  });

  if (existing) {
    throw new Error("Student already registered for this semester");
  }

  // Create registration with selected courses
  return prisma.courseRegistration.create({
    data: {
      studentId: Number(studentId),
      academicSemesterId: Number(academicSemesterId),
      items: {
        create: courseOfferingIds.map((courseOfferingId) => ({
          courseOfferingId: Number(courseOfferingId),
        })),
      },
    },
    include: {
      items: {
        include: {
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
};

// Get all registrations
const getAllCourseRegistrations = async () => {
  return prisma.courseRegistration.findMany({
    include: {
      student: true,
      academicSemester: true,
      items: {
        include: {
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
};

// Get registration by ID
const getCourseRegistrationById = async (id) => {
  return prisma.courseRegistration.findUnique({
    where: { id: Number(id) },
    include: {
      student: true,
      academicSemester: true,
      items: {
        include: {
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
};

// Get registrations of one student
const getRegistrationsByStudent = async (studentId) => {
  return prisma.courseRegistration.findMany({
    where: { studentId: Number(studentId) },
    include: {
      academicSemester: true,
      items: {
        include: {
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
};

// Update registration status
const updateRegistrationStatus = async (id, status) => {
  return prisma.courseRegistration.update({
    where: { id: Number(id) },
    data: { status },
  });
};

// Delete registration
const deleteCourseRegistration = async (id) => {
  return prisma.courseRegistration.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createCourseRegistration,
  getAllCourseRegistrations,
  getCourseRegistrationById,
  getRegistrationsByStudent,
  updateRegistrationStatus,
  deleteCourseRegistration,
};