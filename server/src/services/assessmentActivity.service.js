const prisma = require("../config/prisma");

const createAssessmentActivity = async (data) => {
  const {
    assessmentId,
    assignmentId,
    name,
    maxMarks,
    activityDate,
  } = data;

  // Check assessment
  const assessment =
    await prisma.assessment.findUnique({
      where: {
        id: assessmentId,
      },
    });

  if (!assessment) {
    throw new Error("Assessment not found");
  }

  if (Number(maxMarks) <= 0) {
    throw new Error("maxMarks must be greater than 0");
  }

  // Check assignment if provided
  if (assignmentId) {
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: assignmentId,
        },
      });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    if (
      assignment.courseOfferingId !==
      assessment.courseOfferingId
    ) {
      throw new Error(
        "Assignment does not belong to this course offering"
      );
    }
  }

  return await prisma.assessmentActivity.create({
    data: {
      assessmentId,
      assignmentId: assignmentId || null,
      name,
      maxMarks,
      activityDate: activityDate
        ? new Date(activityDate)
        : null,
    },
  });
};

const getActivitiesByAssessment = async (
  assessmentId
) => {
  return await prisma.assessmentActivity.findMany({
    where: {
      assessmentId,
    },
    include: {
      assignment: true,
    },
    orderBy: {
      id: "asc",
    },
  });
};

module.exports = {
  createAssessmentActivity,
  getActivitiesByAssessment,
};