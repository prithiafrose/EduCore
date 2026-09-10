import api from "./axios";

// Get all sections
export const getAllSections = async () => {
  const response = await api.get("/sections");

  return response.data;
};

// Get section by ID
export const getSectionById = async (id) => {
  const response = await api.get(`/sections/${id}`);

  return response.data;
};

// Create section
export const createSection = async (name, courseOfferingId) => {
  const response = await api.post("/sections", {
    name,
    courseOfferingId,
  });

  return response.data;
};

// Update section
export const updateSection = async (id, name, courseOfferingId) => {
  const response = await api.put(`/sections/${id}`, {
    name,
    courseOfferingId,
  });

  return response.data;
};

// Delete section
export const deleteSection = async (id) => {
  const response = await api.delete(`/sections/${id}`);

  return response.data;
};