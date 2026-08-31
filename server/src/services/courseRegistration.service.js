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
  // Check student belongs to the semester's program
if (student.programId !== semester.programId) {
  throw new Error(
    "Student does not belong to this semester's program"
  );
}
// Check required fees are paid

const requiredFees = await prisma.fee.findMany({
  where: {
    programId: semester.programId,
    academicSemesterId: semester.id,
    type: {
      in: ["SEMESTER", "COURSE_REGISTRATION"],
    },
  },
});

if (requiredFees.length !== 2) {
  throw new Error("Required fees are not configured for this semester");
}

const feeIds = requiredFees.map((fee) => fee.id);

const paidPayments = await prisma.studentPayment.findMany({
  where: {
    studentId: Number(studentId),
    feeId: {
      in: feeIds,
    },
    status: "PAID",
  },
});

if (paidPayments.length !== 2) {
  throw new Error(
    "Student must pay both semester fee and course registration fee"
  );
}
// Check selected courses belong to this semester

const courseOfferings = await prisma.courseOffering.findMany({
  where: {
    id: {
      in: courseOfferingIds.map((id) => Number(id)),
    },
    academicSemesterId: Number(academicSemesterId),
  },
});

if (courseOfferings.length !== courseOfferingIds.length) {
  throw new Error(
    "One or more selected courses do not belong to this semester"
  );
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

const updateRegistrationStatus = async (id, status) => {
  const registration = await prisma.courseRegistration.findUnique({
    where: { id: Number(id) },
    include: {
      academicSemester: true,
    },
  });

  if (!registration) {
    throw new Error("Course registration not found");
  }

  const validStatuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid registration status");
  }

  // Payment validation before approval
  if (status === "APPROVED") {
    const requiredFees = await prisma.fee.findMany({
      where: {
        programId: registration.academicSemester.programId,
        academicSemesterId: registration.academicSemesterId,
        type: {
          in: ["SEMESTER", "COURSE_REGISTRATION"],
        },
      },
    });

    if (requiredFees.length !== 2) {
      throw new Error(
        "Required fees are not configured for this semester"
      );
    }

    const feeIds = requiredFees.map((fee) => fee.id);

    const paidPayments = await prisma.studentPayment.findMany({
      where: {
        studentId: registration.studentId,
        feeId: {
          in: feeIds,
        },
        status: "PAID",
      },
    });

    if (paidPayments.length !== 2) {
      throw new Error(
        "Student must pay both semester fee and course registration fee before approval"
      );
    }
  }

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