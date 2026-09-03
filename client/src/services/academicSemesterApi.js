import api from "./axios";

export const getAcademicSemesters = async () => {
  const response = await api.get("/academic-semesters");
  return response.data;
};

export const createAcademicSemester = async (
  name,
  order,
  programId
) => {
  const response = await api.post("/academic-semesters", {
    name,
    order,
    programId,
  });

  return response.data;
};

export const updateAcademicSemester = async (
  id,
  name,
  order,
  programId
) => {
  const response = await api.put(`/academic-semesters/${id}`, {
    name,
    order,
    programId,
  });

  return response.data;
};

export const deleteAcademicSemester = async (id) => {
  const response = await api.delete(`/academic-semesters/${id}`);
  return response.data;
};