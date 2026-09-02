import api from "./axios";

export const getPrograms = async () => {
  const response = await api.get("/programs");
  return response.data;
};

export const getProgramById = async (id) => {
  const response = await api.get(`/programs/${id}`);
  return response.data;
};

export const createProgram = async (
  name,
  code,
  programType,
  durationYears,
  totalSemesters,
  departmentId
) => {
  const response = await api.post("/programs", {
    name,
    code,
    programType,
    durationYears,
    totalSemesters,
    departmentId,
  });

  return response.data;
};

export const updateProgram = async (
  id,
  name,
  code,
  programType,
  durationYears,
  totalSemesters,
  departmentId
) => {
  const response = await api.put(`/programs/${id}`, {
    name,
    code,
    programType,
    durationYears,
    totalSemesters,
    departmentId,
  });

  return response.data;
};

export const deleteProgram = async (id) => {
  const response = await api.delete(`/programs/${id}`);
  return response.data;
};