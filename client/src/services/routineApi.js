import api from "./axios";

// Get all routines
export const getAllRoutines = async () => {
  const response = await api.get("/timetables");
  return response.data;
};

// Get routine by ID
export const getRoutineById = async (id) => {
  const response = await api.get(`/timetables/${id}`);
  return response.data;
};