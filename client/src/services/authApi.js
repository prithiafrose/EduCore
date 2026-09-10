import api from "./axios";

// LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  const response = await api.post("/auth/change-password", {
    userId: Number(userId),
    oldPassword,
    newPassword,
  });

  return response.data;
};

// LOGOUT
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

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