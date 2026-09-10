import api from "./axios";

export const getAllClassSessions = async () => {
    const response = await api.get("/class-sessions");
    return response.data;
};

export const getClassSessionById = async (id) => {
    const response = await api.get(`/class-sessions/${id}`);
    return response.data;
};

export const createClassSession = async (data) => {
    const response = await api.post("/class-sessions", {
        courseOfferingId: data.courseOfferingId,
        sectionId: data.sectionId || null,
        teacherId: data.teacherId,
        timetableId: data.timetableId ?? null,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room || null,
    });
    return response.data;
};

export const updateClassSession = async (id, data) => {
    const response = await api.put(`/class-sessions/${id}`, {
        courseOfferingId: data.courseOfferingId,
        sectionId: data.sectionId || null,
        teacherId: data.teacherId,
        timetableId: data.timetableId ?? null,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room || null,
    });
    return response.data;
};

export const cancelClassSession = async (id) => {
    const response = await api.patch(`/class-sessions/${id}/cancel`);
    return response.data;
};

export const rescheduleClassSession = async (id, data) => {
    const response = await api.post(`/class-sessions/${id}/reschedule`, {
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room ?? null,
    });

    return response.data;
};
export const getAttendancesByClassSession = async (classSessionId) => {
    const response = await api.get(
        `/attendances/class-session/${classSessionId}`
    );

    return response.data;
};


export const createAttendance = async (
    classSessionId,
    studentId,
    status
) => {
    const response = await api.post("/attendances", {
        classSessionId: Number(classSessionId),
        studentId: Number(studentId),
        status
    });

    return response.data;
};


export const updateAttendance = async (id, status) => {
    const response = await api.put(`/attendances/${id}`, {
        status
    });

    return response.data;
};