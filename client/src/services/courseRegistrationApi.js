import api from "./axios";

// GET all course registrations
export const getAllCourseRegistrations = async () => {
  const response = await api.get("/course-registrations");
  return response.data;
};

// GET course registration by ID
export const getCourseRegistrationById = async (id) => {
  const response = await api.get(`/course-registrations/${id}`);
  return response.data;
};

// GET course registrations by student
export const getRegistrationsByStudent = async (studentId) => {
  const response = await api.get(
    `/course-registrations/student/${studentId}`
  );

  return response.data;
};

// CREATE course registration
export const createCourseRegistration = async (
  studentId,
  academicSemesterId,
  courseOfferingIds
) => {
  const response = await api.post("/course-registrations", {
    studentId: Number(studentId),
    academicSemesterId: Number(academicSemesterId),
    courseOfferingIds: courseOfferingIds.map((id) =>
      Number(id)
    ),
  });

  return response.data;
};

// UPDATE registration status
export const updateRegistrationStatus = async (id, status) => {
  const response = await api.put(`/course-registrations/${id}/status`, {
    status,
  });

  return response.data;
};

// DELETE course registration
export const deleteCourseRegistration = async (id) => {
  const response = await api.delete(`/course-registrations/${id}`);
  return response.data;
};