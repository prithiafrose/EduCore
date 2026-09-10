import api from "./axios";
import { downloadBlob } from "./download";

// GET all course materials
export const getAllCourseMaterials = async () => {
  const response = await api.get("/course-materials");
  return response.data;
};

// GET materials by course offering
export const getMaterialsByCourseOffering = async (
  courseOfferingId
) => {
  const response = await api.get(
    `/course-materials/course-offering/${courseOfferingId}`
  );

  return response.data;
};

// UPLOAD course material (file field: "file")
export const uploadCourseMaterial = async (
  courseOfferingId,
  title,
  description,
  file
) => {
  const formData = new FormData();

  formData.append("courseOfferingId", Number(courseOfferingId));
  formData.append("title", title);
  formData.append("description", description || "");

  if (file) {
    formData.append("file", file);
  }

  const response = await api.post("/course-materials", formData);

  return response.data;
};

// DOWNLOAD course material file
export const downloadCourseMaterialFile = async (id) => {
  await downloadBlob(`/course-materials/${id}/download`, "material");
};

// DELETE course material
export const deleteCourseMaterial = async (id) => {
  const response = await api.delete(`/course-materials/${id}`);
  return response.data;
};