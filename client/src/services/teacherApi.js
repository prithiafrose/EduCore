import api from "./axios";

// GET all teachers
export const getTeachers = async () => {
  const response = await api.get("/teachers");
  return response.data;
};

// CREATE teacher
export const createTeacher = async (
  name,
  email,
  employeeId,
  password
) => {
  const response = await api.post("/teachers", {
    name,
    email,
    employeeId,
    password,
  });

  return response.data;
};

// UPDATE teacher
export const updateTeacher = async (
  id,
  name,
  email,
  employeeId,
  userId
) => {
  const response = await api.put(`/teachers/${id}`, {
    name,
    email,
    employeeId,
    userId: Number(userId),
  });

  return response.data;
};

// DELETE teacher
export const deleteTeacher = async (id) => {
  const response = await api.delete(`/teachers/${id}`);
  return response.data;
};