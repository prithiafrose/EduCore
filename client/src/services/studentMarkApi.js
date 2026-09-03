import api from "./axios";

// GET all student marks
export const getAllStudentMarks = async () => {
  const response = await api.get("/student-marks");
  return response.data;
};

// GET student mark by ID
export const getStudentMarkById = async (id) => {
  const response = await api.get(
    `/student-marks/${id}`
  );

  return response.data;
};

// GET marks by enrollment
export const getMarksByEnrollment = async (
  enrollmentId
) => {
  const response = await api.get(
    `/student-marks/enrollment/${enrollmentId}`
  );

  return response.data;
};

// GET marks by assessment activity
export const getMarksByActivity = async (
  assessmentActivityId
) => {
  const response = await api.get(
    `/student-marks/activity/${assessmentActivityId}`
  );

  return response.data;
};

// CREATE student mark
export const createStudentMark = async (
  enrollmentId,
  assessmentActivityId,
  marks
) => {
  const response = await api.post(
    "/student-marks",
    {
      enrollmentId: Number(enrollmentId),
      assessmentActivityId: Number(
        assessmentActivityId
      ),
      marks: Number(marks),
    }
  );

  return response.data;
};

// UPDATE student mark
export const updateStudentMark = async (
  id,
  marks
) => {
  const response = await api.put(
    `/student-marks/${id}`,
    {
      marks: Number(marks),
    }
  );

  return response.data;
};

// DELETE student mark
export const deleteStudentMark = async (
  id
) => {
  const response = await api.delete(
    `/student-marks/${id}`
  );

  return response.data;
};