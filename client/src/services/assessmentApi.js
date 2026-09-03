import api from "./axios";

// CREATE assessment
export const createAssessment = async (
  courseOfferingId,
  name,
  type,
  maxMarks
) => {
  const response = await api.post("/assessments", {
    courseOfferingId: Number(courseOfferingId),
    name,
    type,
    maxMarks: Number(maxMarks),
  });

  return response.data;
};

// GET assessments by course offering
export const getAssessmentsByCourseOffering = async (
  courseOfferingId
) => {
  const response = await api.get(
    `/assessments/course-offering/${courseOfferingId}`
  );

  return response.data;
};