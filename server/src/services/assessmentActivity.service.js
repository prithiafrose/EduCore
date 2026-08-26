const prisma = require("../config/prisma");

const createAssessmentActivity = async (data) => {
  const {
    assessmentId,
    assignmentId,
    name,
    maxMarks,
    activityDate,
  } = data;

  const assessmentIdNumber = Number(assessmentId);
  const activityMaxMarks = Number(maxMarks);

  // ------------------------------------
  // 1. Check Assessment
  // ------------------------------------

 const assessment =
  await prisma.assessment.findUnique({
    where: {
      id: Number(assessmentId),
    },
    include: {
      activities: true,
    },
  });

 if (!assessment) {
  throw new Error("Assessment not found");
}
// Attendance marks come automatically from Attendance records.
// Attendance must not have AssessmentActivity.
if (assessment.type === "ATTENDANCE") {
  throw new Error(
    "Attendance does not use assessment activities. Attendance marks are calculated automatically from attendance records."
  );
}

  // ------------------------------------
  // 2. Validate Activity Marks
  // ------------------------------------

  if (activityMaxMarks <= 0) {
    throw new Error(
      "maxMarks must be greater than 0"
    );
  }

  // ------------------------------------
  // 3. Calculate Existing Activity Marks
  // ------------------------------------

  const existingActivityMarks =
    assessment.activities.reduce(
      (total, activity) =>
        total + Number(activity.maxMarks),
      0
    );

  // ------------------------------------
  // 4. Prevent Activity Marks > Assessment
  // ------------------------------------

  if (
    existingActivityMarks + activityMaxMarks >
    Number(assessment.maxMarks)
  ) {
    throw new Error(
      `Activity marks cannot exceed assessment maximum of ${assessment.maxMarks}`
    );
  }

  // ------------------------------------
  // 5. Check Assignment
  // ------------------------------------

  if (assignmentId) {
    const assignment =
      await prisma.assignment.findUnique({
        where: {
          id: Number(assignmentId),
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

  // ------------------------------------
  // 6. Create Activity
  // ------------------------------------

  return await prisma.assessmentActivity.create({
    data: {
      assessmentId: assessmentIdNumber,
      assignmentId: assignmentId
        ? Number(assignmentId)
        : null,
      name,
      maxMarks: activityMaxMarks,
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
      assessmentId: Number(assessmentId),
    },
    include: {
      assignment: true,
      marks: true,
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