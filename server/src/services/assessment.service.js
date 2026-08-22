const prisma = require("../config/prisma");

const createAssessment = async (data) => {
  const {
    courseOfferingId,
    name,
    type,
    maxMarks,
  } = data;

  // Check course offering
  const courseOffering =
    await prisma.courseOffering.findUnique({
      where: {
        id: courseOfferingId,
      },
    });

  if (!courseOffering) {
    throw new Error("Course offering not found");
  }

  // Official component limits
  const allowedMarks = {
    ATTENDANCE: 10,
    MIDTERM: 20,
    EVALUATION: 10,
  };

  if (!allowedMarks[type]) {
    throw new Error("Invalid assessment type");
  }

  if (Number(maxMarks) !== allowedMarks[type]) {
    throw new Error(
      `${type} assessment must be ${allowedMarks[type]} marks`
    );
  }

  // Only one component of each type per course
  const existingAssessment =
    await prisma.assessment.findFirst({
      where: {
        courseOfferingId,
        type,
      },
    });

  if (existingAssessment) {
    throw new Error(
      `${type} assessment already exists for this course`
    );
  }

  return await prisma.assessment.create({
    data: {
      courseOfferingId,
      name,
      type,
      maxMarks,
    },
  });
};

const getAssessmentsByCourseOffering = async (
  courseOfferingId
) => {
  return await prisma.assessment.findMany({
    where: {
      courseOfferingId,
    },
    include: {
      activities: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

module.exports = {
  createAssessment,
  getAssessmentsByCourseOffering,
};