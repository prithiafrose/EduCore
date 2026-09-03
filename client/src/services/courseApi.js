import api from "./axios";

// GET all courses
export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// CREATE course
export const createCourse = async (
  code,
  name,
  credit,
  description
) => {
  const response = await api.post("/courses", {
    code,
    name,
    credit: Number(credit),
    description,
  });

  return response.data;
};

// UPDATE course
export const updateCourse = async (
  id,
  code,
  name,
  credit,
  description
) => {
  const response = await api.put(`/courses/${id}`, {
    code,
    name,
    credit: Number(credit),
    description,
  });

  return response.data;
};

// DELETE course
export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);

  return response.data;
};