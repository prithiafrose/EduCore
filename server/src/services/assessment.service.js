const prisma = require("../config/prisma");

const createAssessment = async (data) => {
  const {
    courseOfferingId,
    name,
    type,
    maxMarks,
  } = data;

  const courseOffering =
    await prisma.courseOffering.findUnique({
      where: {
        id: Number(courseOfferingId),
      },
    });

  if (!courseOffering) {
    throw new Error("Course offering not found");
  }

  const marks = Number(maxMarks);

  // ------------------------------------
  // Validate Assessment Type
  // ------------------------------------

  if (
    type !== "ATTENDANCE" &&
    type !== "MIDTERM" &&
    type !== "EVALUATION"
  ) {
    throw new Error("Invalid assessment type");
  }

  // ------------------------------------
  // Attendance must be /10
  // ------------------------------------

  if (type === "ATTENDANCE") {
    if (marks !== 10) {
      throw new Error(
        "Attendance assessment must be 10 marks"
      );
    }
  }

  // ------------------------------------
  // Midterm can be ANY positive marks
  // ------------------------------------

  if (type === "MIDTERM") {
    if (marks <= 0) {
      throw new Error(
        "Midterm assessment marks must be greater than 0"
      );
    }
  }

  // ------------------------------------
  // Evaluation can be ANY positive marks
  // ------------------------------------

  if (type === "EVALUATION") {
    if (marks <= 0) {
      throw new Error(
        "Evaluation assessment marks must be greater than 0"
      );
    }
  }

  // ------------------------------------
  // Attendance: only one
  // ------------------------------------

  if (type === "ATTENDANCE") {
    const existingAttendance =
      await prisma.assessment.findFirst({
        where: {
          courseOfferingId: Number(courseOfferingId),
          type: "ATTENDANCE",
        },
      });

    if (existingAttendance) {
      throw new Error(
        "ATTENDANCE assessment already exists for this course"
      );
    }
  }

  // ------------------------------------
  // Evaluation: only one
  // ------------------------------------

  if (type === "EVALUATION") {
    const existingEvaluation =
      await prisma.assessment.findFirst({
        where: {
          courseOfferingId: Number(courseOfferingId),
          type: "EVALUATION",
        },
      });

    if (existingEvaluation) {
      throw new Error(
        "EVALUATION assessment already exists for this course"
      );
    }
  }

  // ------------------------------------
  // Maximum two Midterms
  // ------------------------------------

  if (type === "MIDTERM") {
    const midtermCount =
      await prisma.assessment.count({
        where: {
          courseOfferingId: Number(courseOfferingId),
          type: "MIDTERM",
        },
      });

    if (midtermCount >= 2) {
      throw new Error(
        "A course can have maximum two MIDTERM assessments"
      );
    }
  }

  // ------------------------------------
  // Create Assessment
  // ------------------------------------

  return await prisma.assessment.create({
    data: {
      courseOfferingId: Number(courseOfferingId),
      name,
      type,
      maxMarks: marks,
    },
  });
};

const getAssessmentsByCourseOffering = async (
  courseOfferingId
) => {
  return await prisma.assessment.findMany({
    where: {
      courseOfferingId: Number(courseOfferingId),
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