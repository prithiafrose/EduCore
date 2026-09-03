import api from "./axios";

// GET all enrollments
export const getEnrollments = async () => {
  const response = await api.get("/enrollments");
  return response.data;
};

// GET enrollment by ID
export const getEnrollmentById = async (id) => {
  const response = await api.get(`/enrollments/${id}`);
  return response.data;
};

// CREATE enrollment
export const createEnrollment = async (
  studentId,
  courseOfferingId,
  sectionId
) => {
  const response = await api.post("/enrollments", {
    studentId: Number(studentId),
    courseOfferingId: Number(courseOfferingId),
    sectionId: sectionId ? Number(sectionId) : null,
  });

  return response.data;
};

// UPDATE enrollment
export const updateEnrollment = async (
  id,
  studentId,
  courseOfferingId,
  sectionId
) => {
  const response = await api.put(`/enrollments/${id}`, {
    studentId: Number(studentId),
    courseOfferingId: Number(courseOfferingId),
    sectionId: sectionId ? Number(sectionId) : null,
  });

  return response.data;
};

// DELETE enrollment
export const deleteEnrollment = async (id) => {
  const response = await api.delete(`/enrollments/${id}`);
  return response.data;
};