import api from "./axios";

// Get all teacher assignments
export const getAllTeacherAssignments = async () => {
    const response = await api.get("/teacher-assignments");

    return response.data;
};

// Get assignments by teacher
export const getTeacherAssignmentsByTeacher = async (
    teacherId
) => {
    const response = await api.get(
        `/teacher-assignments/teacher/${teacherId}`
    );

    return response.data;
};