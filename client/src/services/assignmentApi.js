import api from "./axios";
import { downloadBlob } from "./download";

// GET all assignments
export const getAllAssignments = async () => {
  const response = await api.get("/assignments");
  return response.data;
};

// GET assignment by ID
export const getAssignmentById = async (id) => {
  const response = await api.get(`/assignments/${id}`);
  return response.data;
};

// GET assignments by course offering
export const getAssignmentsByCourseOffering = async (
  courseOfferingId
) => {
  const response = await api.get(
    `/assignments/course-offering/${courseOfferingId}`
  );

  return response.data;
};

// CREATE assignment (accepts an optional file, sent as multipart)
export const createAssignment = async (
  courseOfferingId,
  teacherId,
  title,
  description,
  deadline,
  file
) => {
  const formData = new FormData();

  formData.append("courseOfferingId", Number(courseOfferingId));
  formData.append("teacherId", Number(teacherId));
  formData.append("title", title);
  formData.append("description", description || "");
  formData.append("deadline", deadline);

  if (file) {
    formData.append("attachment", file);
  }

  const response = await api.post("/assignments", formData);

  return response.data;
};

// UPDATE assignment
export const updateAssignment = async (id, data, file) => {
  const formData = new FormData();

  if (data.courseOfferingId !== undefined) {
    formData.append(
      "courseOfferingId",
      Number(data.courseOfferingId)
    );
  }

  if (data.teacherId !== undefined) {
    formData.append("teacherId", Number(data.teacherId));
  }

  if (data.title !== undefined) {
    formData.append("title", data.title);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description || "");
  }

  if (data.deadline !== undefined) {
    formData.append("deadline", data.deadline);
  }

  if (file) {
    formData.append("attachment", file);
  }

  const response = await api.put(`/assignments/${id}`, formData);

  return response.data;
};

// DOWNLOAD assignment attachment
export const downloadAssignmentAttachment = async (id) => {
  await downloadBlob(
    `/assignments/${id}/attachment`,
    `assignment-${id}-attachment`
  );
};

// DELETE assignment
export const deleteAssignment = async (id) => {
  const response = await api.delete(`/assignments/${id}`);
  return response.data;
};