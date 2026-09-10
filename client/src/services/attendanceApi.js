import api from "./axios";


// Get attendance marks for a course offering
export const getAttendanceMarksByCourseOffering = async (
    courseOfferingId
) => {
    const response = await api.get(
        `/attendances/course-offering/${courseOfferingId}/marks`
    );

    return response.data;
};


// Get attendance records for a class session
export const getAttendancesByClassSession = async (
    classSessionId
) => {
    const response = await api.get(
        `/attendances/class-session/${classSessionId}`
    );

    return response.data;
};


// Create attendance
export const createAttendance = async (
    classSessionId,
    studentId,
    status
) => {
    const response = await api.post(
        "/attendances",
        {
            classSessionId: Number(classSessionId),
            studentId: Number(studentId),
            status
        }
    );

    return response.data;
};


// Update attendance
export const updateAttendance = async (
    id,
    status
) => {
    const response = await api.put(
        `/attendances/${id}`,
        {
            status
        }
    );

    return response.data;
};


// Get full classroom attendance
export const getClassroomAttendance = async (
    courseOfferingId
) => {
    const response = await api.get(
        `/attendances/course-offering/${courseOfferingId}/classroom`
    );

    return response.data;
};
// Get attendance records for a student
export const getAttendancesByStudentId = async (studentId) => {
  const response = await api.get(
    `/attendances/student/${studentId}`
  );

  return response.data;
};