import { useEffect, useState } from "react";

import { getStudentByUserId } from "../../services/studentApi";
import { getFeesByProgram } from "../../services/feeApi";

import {
  getPaymentsByStudent,
  createStudentPayment,
  checkoutStudentPayment,
  openPaymentReceipt,
} from "../../services/studentPaymentApi";

function Payments() {
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processingFeeId, setProcessingFeeId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

  // Load student, fees and payments
  const loadPaymentData = async () => {
    try {
      if (!storedUser?.id) {
        throw new Error("User information not found");
      }

      // Get logged-in student
      const currentStudent = await getStudentByUserId(
        storedUser.id
      );

      if (!currentStudent) {
        throw new Error("Student profile not found");
      }

      // Get fees for student's program
      const feeResponse = await getFeesByProgram(
        currentStudent.programId
      );

      const studentFees =
        feeResponse?.data ||
        feeResponse ||
        [];

      // Get student's payment history
      const paymentResponse =
        await getPaymentsByStudent(
          currentStudent.id
        );

      const studentPayments =
        paymentResponse?.data ||
        paymentResponse ||
        [];

      // Update state after async operations
      setStudent(currentStudent);
      setFees(studentFees);
      setPayments(studentPayments);
      setError("");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load payment information"
      );
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  let ignore = false;

  const fetchData = async () => {
    if (!ignore) {
      await loadPaymentData();
    }
  };

  fetchData();

  return () => {
    ignore = true;
  };
}, []);

  // Find payment for a specific fee
  const getPaymentForFee = (feeId) => {
    return payments.find(
      (payment) =>
        Number(payment.feeId) === Number(feeId)
    );
  };

  // Pay fee
  const handlePayNow = async (fee) => {
    try {
      setProcessingFeeId(fee.id);
      setError("");
      setSuccess("");

      const existingPayment =
        getPaymentForFee(fee.id);

      let payment;

      // No payment exists - create one
      if (!existingPayment) {
        const created =
          await createStudentPayment(
            student.id,
            fee.id,
            fee.amount
          );

        payment = created?.data || created;
      } else {
        payment = existingPayment;
      }

      // Start the gateway checkout flow
      const checkout =
        await checkoutStudentPayment(
          payment.id
        );

      const checkoutUrl =
        checkout?.data?.checkoutUrl;

      if (checkoutUrl) {
        window.location.assign(checkoutUrl);

        return;
      }

      await loadPaymentData();

      setSuccess(
        "Payment request submitted. Please wait for confirmation."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed"
      );
    } finally {
      setProcessingFeeId(null);
    }
  };

  // View receipt
  const handleViewReceipt = async (payment) => {
    try {
      setError("");
      setSuccess("");

      await openPaymentReceipt(payment.id);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to open receipt."
      );
    }
  };

  // Status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Format amount
  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-BD",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // Total fees
  const totalAmount = fees.reduce(
    (total, fee) =>
      total + Number(fee.amount || 0),
    0
  );

  // Total paid
  const paidAmount = payments
    .filter(
      (payment) =>
        payment.status === "PAID"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  // Remaining amount
  const pendingAmount =
    totalAmount - paidAmount;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">
          Loading payment information...
        </div>
      </div>
    );
  }

  return (
        <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Payments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your university fees and payments
          </p>
        </div>

        {/* Student Information */}
        {student && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

            <h2 className="text-xl font-semibold text-gray-800">
              {student.name}
            </h2>

            <p className="text-gray-500 mt-1">
              Student ID: {student.studentId}
            </p>

            {student.program && (
              <p className="text-gray-500">
                Program: {student.program.name}
              </p>
            )}

          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Total Fees
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-2">
              ৳ {formatAmount(totalAmount)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Paid
            </p>

            <p className="text-2xl font-bold text-green-600 mt-2">
              ৳ {formatAmount(paidAmount)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Remaining
            </p>

            <p className="text-2xl font-bold text-orange-600 mt-2">
              ৳{" "}
              {formatAmount(
                Math.max(pendingAmount, 0)
              )}
            </p>
          </div>

        </div>

        {/* Available Fees */}
        <div className="bg-white rounded-xl shadow-sm">

          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Available Fees
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Fees assigned to your program
            </p>
          </div>

          {fees.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No fees found for your program.
            </div>

          ) : (

            <div className="divide-y">

              {fees.map((fee) => {

                const payment =
                  getPaymentForFee(fee.id);

                return (
                  <div
                    key={fee.id}
                    className="p-6 hover:bg-gray-50"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                      {/* Fee Information */}
                      <div className="flex-1">

                        <div className="flex items-center gap-3">

                          <h3 className="text-lg font-semibold text-gray-800">
                            {fee.type}
                          </h3>

                          {payment && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          )}

                        </div>

                        {fee.description && (
                          <p className="text-gray-500 mt-2">
                            {fee.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-6 mt-4 text-sm">

                          {fee.academicSemester && (
                            <div>
                              <span className="text-gray-400">
                                Semester
                              </span>

                              <p className="font-medium text-gray-700">
                                {
                                  fee
                                    .academicSemester
                                    .name
                                }
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-gray-400">
                              Due Date
                            </span>

                            <p className="font-medium text-gray-700">
                              {formatDate(
                                fee.dueDate
                              )}
                            </p>
                          </div>

                          {payment?.paidAt && (
                            <div>
                              <span className="text-gray-400">
                                Paid On
                              </span>

                              <p className="font-medium text-gray-700">
                                {formatDate(
                                  payment.paidAt
                                )}
                              </p>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Amount */}
                      <div className="flex items-center gap-6">

                        <div className="text-right">

                          <p className="text-sm text-gray-500">
                            Amount
                          </p>

                          <p className="text-xl font-bold text-gray-800">
                            ৳{" "}
                            {formatAmount(
                              fee.amount
                            )}
                          </p>

                        </div>

                        {payment?.status ===
                        "PAID" ? (

                          <button
                            disabled
                            className="px-5 py-2.5 rounded-lg bg-green-100 text-green-700 font-medium cursor-not-allowed"
                          >
                            Paid
                          </button>

                        ) : payment?.status ===
                          "PENDING" ? (

                          <button
                            disabled
                            className="px-5 py-2.5 rounded-lg bg-yellow-100 text-yellow-700 font-medium cursor-not-allowed"
                          >
                            Awaiting Confirmation
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handlePayNow(fee)
                            }
                            disabled={
                              processingFeeId ===
                              fee.id
                            }
                            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingFeeId ===
                            fee.id
                              ? "Processing..."
                              : payment
                              ? "Retry Payment"
                              : "Pay Now"}
                          </button>

                        )}

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm mt-8">

          <div className="p-6 border-b">

            <h2 className="text-xl font-semibold text-gray-800">
              Payment History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your previous payment records
            </p>

          </div>

          {payments.length === 0 ? (

            <div className="p-8 text-center text-gray-500">
              No payment history available.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Fee
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Semester
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Paid On
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Receipt
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {payments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {payment.fee?.type ||
                          "Fee"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {payment.fee
                          ?.academicSemester
                          ?.name ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-gray-800">
                        ৳{" "}
                        {formatAmount(
                          payment.amount
                        )}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(
                          payment.paidAt
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewReceipt(payment)
                          }
                          disabled={
                            payment.status !== "PAID"
                          }
                          className={
                            payment.status === "PAID"
                              ? "px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                              : "px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
                          }
                        >
                          Receipt
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        </>
  );
}

export default Payments;