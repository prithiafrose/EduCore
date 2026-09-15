import { useEffect, useState } from "react";

import {
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
} from "../../services/feeApi";

import {
  getAllStudentPayments,
  updatePaymentStatus,
  deleteStudentPayment,
} from "../../services/studentPaymentApi";

import { getPrograms } from "../../services/programApi";
import { getAcademicSemesters } from "../../services/academicSemesterApi";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [programId, setProgramId] = useState("");
  const [academicSemesterId, setAcademicSemesterId] =
    useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------
  // Load All Data
  // ----------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [feeData, paymentData, programData, semesterData] =
        await Promise.all([
          getAllFees(),
          getAllStudentPayments(),
          getPrograms(),
          getAcademicSemesters(),
        ]);

      setFees(feeData?.data || feeData || []);
      setPayments(paymentData?.data || paymentData || []);
      setPrograms(programData);
      setSemesters(semesterData);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load fees."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Load Initial Data
  // ----------------------------
  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------------
  // Reset Form
  // ----------------------------
  const resetForm = () => {
    setProgramId("");
    setAcademicSemesterId("");
    setType("");
    setAmount("");
    setDueDate("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  // ----------------------------
  // Validate Form
  // ----------------------------
  const validateForm = () => {
    if (!programId) {
      setError("Please select a program.");
      return false;
    }

    if (!academicSemesterId) {
      setError("Please select a semester.");
      return false;
    }

    if (!type) {
      setError("Please select a fee type.");
      return false;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return false;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return false;
    }

    return true;
  };

  // ----------------------------
  // Create / Update Fee
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        programId: Number(programId),
        academicSemesterId: Number(academicSemesterId),
        type,
        amount: Number(amount),
        dueDate: new Date(dueDate).toISOString(),
        description: description || null,
      };

      if (editingId) {
        await updateFee(editingId, payload);

        setSuccess("Fee updated successfully.");
      } else {
        await createFee(payload);

        setSuccess("Fee created successfully.");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save fee."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Edit Fee
  // ----------------------------
  const handleEdit = (fee) => {
    setError("");
    setSuccess("");

    setEditingId(fee.id);
    setProgramId(String(fee.programId));
    setAcademicSemesterId(String(fee.academicSemesterId));
    setType(fee.type);
    setAmount(String(fee.amount));
    setDueDate(
      new Date(fee.dueDate).toISOString().slice(0, 10)
    );
    setDescription(fee.description || "");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------
  // Delete Fee
  // ----------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fee?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteFee(id);

      setSuccess("Fee deleted successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete fee."
      );
    }
  };

  // ----------------------------
  // Payment Status Update
  // ----------------------------
  const handleUpdatePaymentStatus = async (payment, status) => {
    try {
      setError("");
      setSuccess("");

      await updatePaymentStatus(payment.id, status);

      setSuccess("Payment status updated to " + status + ".");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update payment."
      );
    }
  };

  // ----------------------------
  // Delete Payment
  // ----------------------------
  const handleDeletePayment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteStudentPayment(id);

      setSuccess("Payment deleted successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete payment."
      );
    }
  };

  // ----------------------------
  // Helpers
  // ----------------------------
  const getProgramName = (id) => {
    const program = programs.find(
      (item) => Number(item.id) === Number(id)
    );

    return program?.name || `Program #${id}`;
  };

  const getSemesterName = (id) => {
    const semester = semesters.find(
      (item) => Number(item.id) === Number(id)
    );

    return semester?.name || `Semester #${id}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Revenue summary
  const paidTotal = payments
    .filter((payment) => payment.status === "PAID")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const pendingTotal = payments
    .filter((payment) => payment.status === "PENDING")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
      <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Fees & Payments
          </h1>

          <p className="mt-2 text-gray-500">
            Configure semester and registration fees, and manage
            student payments.
          </p>
        </div>

        </div>

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-gray-500">
            Total Fees Configured
          </p>

          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {fees.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-gray-500">
            Collected Revenue
          </p>

          <h3 className="text-2xl font-bold text-green-600 mt-2">
            ৳ {formatAmount(paidTotal)}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm text-gray-500">
            Outstanding (Pending)
          </p>

          <h3 className="text-2xl font-bold text-orange-600 mt-2">
            ৳ {formatAmount(pendingTotal)}
          </h3>
        </div>
      </div>

      {/* Fees Management */}
      <div className="rounded-xl bg-white shadow mb-8">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Fee Configuration
            </h2>

            <p className="text-sm text-gray-500">
              Total Fees: {fees.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setError("");
                setSuccess("");
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add Fee"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border-b bg-gray-50 p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800">
              {editingId ? "Edit Fee" : "Create Fee"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Program */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Program
                  </label>

                  <select
                    value={programId}
                    onChange={(e) =>
                      setProgramId(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Program</option>

                    {programs.map((program) => (
                      <option
                        key={program.id}
                        value={program.id}
                      >
                        {program.name} ({program.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Semester
                  </label>

                  <select
                    value={academicSemesterId}
                    onChange={(e) =>
                      setAcademicSemesterId(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Semester</option>

                    {semesters.map((semester) => (
                      <option
                        key={semester.id}
                        value={semester.id}
                      >
                        {semester.name} —{" "}
                        {getProgramName(semester.programId)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fee Type
                  </label>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="SEMESTER">Semester</option>
                    <option value="COURSE_REGISTRATION">
                      Course Registration
                    </option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount (৳)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. 25000"
                    required
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                    <span className="ml-1 text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Fall 2026 Semester Fee"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                    ? "Update Fee"
                    : "Create Fee"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg bg-gray-500 px-6 py-2.5 font-medium text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fees Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading fees...
            </div>
          ) : fees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No fees configured yet.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr className="border-b">
                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Program
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Semester
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Type
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Due Date
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Payments
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {fees.map((fee, index) => {
                  const feePayments = payments.filter(
                    (payment) =>
                      Number(payment.feeId) === Number(fee.id)
                  );

                  const paidCount = feePayments.filter(
                    (payment) => payment.status === "PAID"
                  ).length;

                  return (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {fee.program?.name ||
                          getProgramName(fee.programId)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {fee.academicSemester?.name ||
                          getSemesterName(fee.academicSemesterId)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {fee.type.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ৳ {formatAmount(fee.amount)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {formatDate(fee.dueDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {paidCount}/{feePayments.length} paid
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(fee)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(fee.id)
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Management */}
      <div className="rounded-xl bg-white shadow">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Student Payments
          </h2>

          <p className="text-sm text-gray-500">
            Total Payments: {payments.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payments recorded yet.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr className="border-b">
                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Student
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Fee
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Paid On
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {payment.student?.name || "Unknown"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {payment.student?.studentId || ""}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {payment.fee?.type || "Fee"}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-800">
                      ৳ {formatAmount(payment.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        {payment.status !== "PAID" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdatePaymentStatus(
                                payment,
                                "PAID"
                              )
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeletePayment(payment.id)
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
  );
};

export default Fees;