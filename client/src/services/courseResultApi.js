import api from "./axios";

// GET all course results
export const getAllCourseResults = async () => {
  const response = await api.get("/course-results");
  return response.data;
};

// GET course result by enrollment
export const getCourseResultByEnrollment = async (
  enrollmentId
) => {
  const response = await api.get(
    `/course-results/enrollment/${enrollmentId}`
  );

  return response.data;
};

// GENERATE course result for an enrollment
export const generateCourseResult = async (enrollmentId) => {
  const response = await api.post(
    `/course-results/generate/${enrollmentId}`
  );

  return response.data;
};

// GET student transcript
export const getStudentTranscript = async (studentId) => {
  const response = await api.get(
    `/course-results/student/${studentId}/transcript`
  );

  return response.data;
};