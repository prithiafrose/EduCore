import api from "./axios";
import { openBlobInNewTab } from "./download";

// Open the payment receipt (HTML) in a new tab
export const openPaymentReceipt = async (id) => {
  await openBlobInNewTab(`/student-payments/${id}/receipt`);
};

// Get all student payments
export const getAllStudentPayments = async () => {
  const response = await api.get("/student-payments");
  return response.data;
};

// Get student payment by ID
export const getStudentPaymentById = async (id) => {
  const response = await api.get(
    `/student-payments/${id}`
  );

  return response.data;
};

// Get payments by student
export const getPaymentsByStudent = async (studentId) => {
  const response = await api.get(
    `/student-payments/student/${studentId}`
  );

  return response.data;
};

// Create student payment
export const createStudentPayment = async (
  studentId,
  feeId,
  amount
) => {
  const response = await api.post("/student-payments", {
    studentId: Number(studentId),
    feeId: Number(feeId),
    amount,
  });

  return response.data;
};

// Checkout payment (starts gateway flow)
export const checkoutStudentPayment = async (id) => {
  const response = await api.post(
    `/student-payments/${id}/checkout`
  );

  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (id, status) => {
  const response = await api.put(
    `/student-payments/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// Delete student payment
export const deleteStudentPayment = async (id) => {
  const response = await api.delete(
    `/student-payments/${id}`
  );

  return response.data;
};