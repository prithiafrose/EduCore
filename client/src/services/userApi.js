import api from "./axios";

// GET all users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// CREATE user
export const createUser = async (
  email,
  password,
  role
) => {
  const response = await api.post("/users", {
    email,
    password,
    role,
  });

  return response.data;
};

// UPDATE user
export const updateUser = async (
  id,
  email,
  password,
  role
) => {
  const response = await api.put(`/users/${id}`, {
    email,
    password,
    role,
  });

  return response.data;
};

// DELETE user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);

  return response.data;
};