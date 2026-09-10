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

// Create teacher assignment
export const createTeacherAssignment = async (
    teacherId,
    courseOfferingId,
    sectionId
) => {
    const response = await api.post(
        "/teacher-assignments",
        {
            teacherId,
            courseOfferingId,
            sectionId: sectionId || null,
        }
    );

    return response.data;
};

// Delete teacher assignment
export const deleteTeacherAssignment = async (id) => {
    const response = await api.delete(
        `/teacher-assignments/${id}`
    );

    return response.data;
};