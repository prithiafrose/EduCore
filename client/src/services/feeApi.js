import api from "./axios";

// Get all fees
export const getAllFees = async () => {
  const response = await api.get("/fees");
  return response.data;
};

// Get fee by ID
export const getFeeById = async (id) => {
  const response = await api.get(`/fees/${id}`);
  return response.data;
};

// Get fees by program
export const getFeesByProgram = async (programId) => {
  const response = await api.get(`/fees/program/${programId}`);
  return response.data;
};

// Get fees by academic semester
export const getFeesBySemester = async (academicSemesterId) => {
  const response = await api.get(
    `/fees/semester/${academicSemesterId}`
  );

  return response.data;
};

// Create fee
export const createFee = async (data) => {
  const response = await api.post("/fees", data);
  return response.data;
};

// Update fee
export const updateFee = async (id, data) => {
  const response = await api.put(`/fees/${id}`, data);
  return response.data;
};

// Delete fee
export const deleteFee = async (id) => {
  const response = await api.delete(`/fees/${id}`);
  return response.data;
};