import api from "./axios";

// GET all course offerings
export const getCourseOfferings = async () => {
  const response = await api.get("/course-offerings");
  return response.data;
};

// CREATE course offering
export const createCourseOffering = async (
  courseId,
  academicSemesterId
) => {
  const response = await api.post("/course-offerings", {
    courseId: Number(courseId),
    academicSemesterId: Number(academicSemesterId),
  });

  return response.data;
};

// UPDATE course offering
export const updateCourseOffering = async (
  id,
  courseId,
  academicSemesterId
) => {
  const response = await api.put(`/course-offerings/${id}`, {
    courseId: Number(courseId),
    academicSemesterId: Number(academicSemesterId),
  });

  return response.data;
};

// DELETE course offering
export const deleteCourseOffering = async (id) => {
  const response = await api.delete(`/course-offerings/${id}`);

  return response.data;
};