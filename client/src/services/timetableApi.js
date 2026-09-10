import api from "./axios";

// ==============================
// GET all timetable entries
// ==============================
export const getAllTimetables = async () => {
  const response = await api.get("/timetables");
  return response.data;
};

// ==============================
// GET timetable by ID
// ==============================
export const getTimetableById = async (id) => {
  const response = await api.get(`/timetables/${id}`);
  return response.data;
};

// ==============================
// CREATE timetable
// (Admin uses this)
// ==============================
export const createTimetable = async (data) => {
  const response = await api.post("/timetables", data);
  return response.data;
};

// ==============================
// UPDATE timetable
// ==============================
export const updateTimetable = async (id, data) => {
  const response = await api.put(`/timetables/${id}`, data);
  return response.data;
};

// ==============================
// DELETE timetable
// ==============================
export const deleteTimetable = async (id) => {
  const response = await api.delete(`/timetables/${id}`);
  return response.data;
};
// ==============================
// GET timetables by student ID
// (Student uses this)
// ==============================
export const getTimetablesByStudentId = async (studentId) => {
  const response = await api.get(
    `/timetables/student/${studentId}`
  );

  return response.data;
};