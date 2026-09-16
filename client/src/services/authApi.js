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

// GET CURRENT PROFILE
export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// UPDATE PROFILE (name / email / avatarUrl)
export const updateProfile = async (data) => {
  const response = await api.put("/auth/profile", data);

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

// FORGOT PASSWORD (request reset link by email)
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });

  return response.data;
};

// RESET PASSWORD (with token from the reset email)
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};