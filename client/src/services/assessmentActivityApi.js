import api from "./axios";

// GET activities by assessment
export const getActivitiesByAssessment = async (
  assessmentId
) => {
  const response = await api.get(
    `/assessment-activities/assessment/${assessmentId}`
  );

  return response.data;
};

// CREATE assessment activity
export const createAssessmentActivity = async (
  assessmentId,
  name,
  maxMarks,
  assignmentId = null,
  activityDate = null
) => {
  const response = await api.post(
    "/assessment-activities",
    {
      assessmentId: Number(assessmentId),
      name,
      maxMarks: Number(maxMarks),
      assignmentId: assignmentId
        ? Number(assignmentId)
        : null,
      activityDate: activityDate || null,
    }
  );

  return response.data;
};