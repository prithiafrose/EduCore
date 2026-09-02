import api from "./axios";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const createDepartment = async (name, code) => {
  const response = await api.post("/departments", {
    name,
    code,
  });

  return response.data;
};
export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};
export const updateDepartment = async (id, name, code) => {
  const response = await api.put(`/departments/${id}`, {
    name,
    code,
  });

  return response.data;
};