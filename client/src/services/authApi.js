import api from "./axios";

// LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// REGISTER STUDENT
export const registerStudent = async (
  name,
  studentId,
  email,
  programId,
  password
) => {
  const response = await api.post("/auth/register", {
    name,
    studentId,
    email,
    programId,
    password,
  });

  return response.data;
};