import api from "./axios";

// Get all students
export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

// Get student by ID
export const getStudentById = async (id) => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

// Create student
export const createStudent = async (
  studentId,
  name,
  email,
  programId,
  password
) => {
  const response = await api.post("/students", {
    studentId,
    name,
    email,
    programId,
    password,
  });

  return response.data;
};

// Update student
export const updateStudent = async (
  id,
  studentId,
  name,
  email,
  programId
) => {
  const response = await api.put(`/students/${id}`, {
    studentId,
    name,
    email,
    programId,
  });

  return response.data;
};

// Delete student
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};