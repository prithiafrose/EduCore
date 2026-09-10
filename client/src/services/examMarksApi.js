import api from "./axios";

// GET all exam marks
export const getAllExamMarks = async () => {
  const response = await api.get("/exam-marks");
  return response.data;
};

// GET exam mark by ID
export const getExamMarkById = async (id) => {
  const response = await api.get(`/exam-marks/${id}`);
  return response.data;
};

// CREATE exam mark
export const createExamMark = async (
  examId,
  enrollmentId,
  marks
) => {
  const response = await api.post("/exam-marks", {
    examId: Number(examId),
    enrollmentId: Number(enrollmentId),
    marks: Number(marks),
  });

  return response.data;
};

// UPDATE exam mark
export const updateExamMark = async (id, marks) => {
  const response = await api.put(`/exam-marks/${id}`, {
    marks: Number(marks),
  });

  return response.data;
};

// DELETE exam mark
export const deleteExamMark = async (id) => {
  const response = await api.delete(`/exam-marks/${id}`);
  return response.data;
};