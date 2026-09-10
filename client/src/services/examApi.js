import api from "./axios";

// GET all exams
export const getAllExams = async () => {
  const response = await api.get("/exams");
  return response.data;
};

// GET exam by ID
export const getExamById = async (id) => {
  const response = await api.get(`/exams/${id}`);
  return response.data;
};

// CREATE exam
export const createExam = async (data) => {
  const response = await api.post("/exams", {
    courseOfferingId: Number(data.courseOfferingId),
    type: data.type,
    maxMarks: Number(data.maxMarks),
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    room: data.room || null,
  });

  return response.data;
};

// UPDATE exam
export const updateExam = async (id, data) => {
  const response = await api.put(`/exams/${id}`, {
    courseOfferingId:
      data.courseOfferingId !== undefined
        ? Number(data.courseOfferingId)
        : undefined,

    type: data.type,
    maxMarks:
      data.maxMarks !== undefined
        ? Number(data.maxMarks)
        : undefined,

    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    room: data.room,
  });

  return response.data;
};

// DELETE exam
export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};