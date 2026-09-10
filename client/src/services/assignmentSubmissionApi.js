import api from "./axios";
import { downloadBlob } from "./download";

// GET submissions by assignment
export const getSubmissionsByAssignment = async (
  assignmentId
) => {
  const response = await api.get(
    `/assignment-submissions/assignment/${assignmentId}`
  );

  return response.data;
};

// GET submissions by student
export const getSubmissionsByStudent = async (studentId) => {
  const response = await api.get(
    `/assignment-submissions/student/${studentId}`
  );

  return response.data;
};

// GET submission by ID
export const getSubmissionById = async (id) => {
  const response = await api.get(
    `/assignment-submissions/${id}`
  );

  return response.data;
};

// CREATE submission (accepts an optional file, sent as multipart)
export const createSubmission = async (
  assignmentId,
  studentId,
  note,
  file
) => {
  const formData = new FormData();

  formData.append("assignmentId", Number(assignmentId));
  formData.append("studentId", Number(studentId));

  if (note) {
    formData.append("note", note);
  }

  if (file) {
    formData.append("file", file);
  }

  const response = await api.post(
    "/assignment-submissions",
    formData
  );

  return response.data;
};

// UPDATE submission (grade / feedback)
export const updateSubmission = async (id, data) => {
  const response = await api.put(
    `/assignment-submissions/${id}`,
    {
      marks:
        data.marks !== undefined
          ? Number(data.marks)
          : undefined,

      feedback: data.feedback,
    }
  );

  return response.data;
};

// DOWNLOAD submission file
export const downloadSubmissionFile = async (id) => {
  await downloadBlob(
    `/assignment-submissions/${id}/download`,
    `submission-${id}-file`
  );
};

// DELETE submission
export const deleteSubmission = async (id) => {
  const response = await api.delete(
    `/assignment-submissions/${id}`
  );

  return response.data;
};