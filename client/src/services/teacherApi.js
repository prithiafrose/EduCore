import api from "./axios";


// GET all teachers
export const getTeachers = async () => {
    const response = await api.get("/teachers");
    return response.data;
};


// Alias for Profile.jsx
export const getAllTeachers = async () => {
    const response = await api.get("/teachers");
    return response.data;
};


// GET teacher by ID
export const getTeacherById = async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
};


// CREATE teacher
export const createTeacher = async (data) => {
    const response = await api.post("/teachers", {
        name: data.name,
        email: data.email,
        employeeId: data.employeeId,
        password: data.password,
        designation: data.designation || null,
        departmentId: data.departmentId || null,
    });

    return response.data;
};


// UPDATE teacher
export const updateTeacher = async (id, data) => {
    const response = await api.put(`/teachers/${id}`, {
        name: data.name,
        email: data.email,
        employeeId: data.employeeId,
        userId: Number(data.userId),
        designation: data.designation || null,
        departmentId: data.departmentId || null,
    });

    return response.data;
};


// DELETE teacher
export const deleteTeacher = async (id) => {
    const response = await api.delete(`/teachers/${id}`);

    return response.data;
};