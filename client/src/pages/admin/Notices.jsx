import { useEffect, useState } from "react";

import {
  getAllNotifications,
  createNotification,
  deleteNotification,
  archiveNotification,
  unarchiveNotification,
} from "../../services/notificationApi";

import { getUsers } from "../../services/userApi";

import { runAtRiskCheck } from "../../services/aiApi";

const NOTIFICATION_TYPES = [
  "GENERAL",
  "CLASS_CANCELLED",
  "CLASS_RESCHEDULED",
  "CLASS_REMINDER",
  "ASSIGNMENT",
  "ASSIGNMENT_DEADLINE",
  "ASSESSMENT_MARK_PUBLISHED",
  "RESULT_PUBLISHED",
  "PAYMENT_DUE",
  "EXAM_SCHEDULE",
];

const Notices = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [userId, setUserId] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [atRiskResult, setAtRiskResult] = useState(null);
  const [atRiskLoading, setAtRiskLoading] = useState(false);
  const [atRiskError, setAtRiskError] = useState("");

  // ----------------------------
  // Load All Data
  // ----------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [notificationResponse, userResponse] =
        await Promise.all([
          getAllNotifications(),
          getUsers(),
        ]);

      const notificationsList = Array.isArray(
        notificationResponse
      )
        ? notificationResponse
        : notificationResponse?.data || [];

      const usersList = Array.isArray(userResponse)
        ? userResponse
        : userResponse?.data || [];

      setNotifications(notificationsList);
      setUsers(usersList);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load notices."
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
    setUserId("");
    setType("");
    setTitle("");
    setMessage("");
    setShowForm(false);
    setError("");
  };

  // ----------------------------
  // Validate Form
  // ----------------------------
  const validateForm = () => {
    if (!userId) {
      setError("Please select a recipient.");
      return false;
    }

    if (!type) {
      setError("Please select a notice type.");
      return false;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return false;
    }

    if (!message.trim()) {
      setError("Message is required.");
      return false;
    }

    return true;
  };

  // ----------------------------
  // Create Notice
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

      await createNotification(
        userId,
        type,
        title.trim(),
        message.trim()
      );

      setSuccess("Notice published successfully.");

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to publish notice."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Delete Notice
  // ----------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteNotification(id);

      setSuccess("Notice deleted successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete notice."
      );
    }
  };

  // ----------------------------
  // Archive Notice
  // ----------------------------
  const handleArchive = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this notice?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await archiveNotification(id);

      setSuccess("Notice archived successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to archive notice."
      );
    }
  };

  // ----------------------------
  // Unarchive Notice
  // ----------------------------
  const handleUnarchive = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to restore this notice?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await unarchiveNotification(id);

      setSuccess("Notice restored successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to restore notice."
      );
    }
  };

  // ----------------------------
  // Run At-Risk Student Check
  // ----------------------------
  const handleRunAtRiskCheck = async () => {
    setAtRiskError("");
    setError("");
    setSuccess("");

    try {
      setAtRiskLoading(true);

      const response = await runAtRiskCheck();

      const result = response?.data || null;

      setAtRiskResult(result);

      await fetchData();
    } catch (error) {
      console.error(error);

      setAtRiskError(
        error.response?.data?.message ||
          "Failed to run at-risk check."
      );
    } finally {
      setAtRiskLoading(false);
    }
  };

  // ----------------------------
  // Get user email by ID
  // ----------------------------
  const getUserEmail = (id) => {
    const user = users.find(
      (item) => Number(item.id) === Number(id)
    );

    return user?.email || `User #${id}`;
  };

  // ----------------------------
  // Helpers
  // ----------------------------
  const getTypeClass = (type) => {
    switch (type) {
      case "GENERAL":
        return "bg-blue-500/15 text-blue-300";
      case "CLASS_CANCELLED":
      case "CLASS_RESCHEDULED":
        return "bg-orange-100 text-orange-700";
      case "ASSIGNMENT":
      case "ASSIGNMENT_DEADLINE":
        return "bg-purple-500/15 text-purple-300";
      case "RESULT_PUBLISHED":
      case "ASSESSMENT_MARK_PUBLISHED":
        return "bg-emerald-500/15 text-emerald-300";
      case "PAYMENT_DUE":
        return "bg-red-500/15 text-red-300";
      case "EXAM_SCHEDULE":
        return "bg-indigo-500/15 text-indigo-300";
      default:
        return "bg-white/5 text-slate-200";
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtered list
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      notification.message
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      getUserEmail(notification.userId)
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
      <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Notice Board
          </h1>

          <p className="mt-2 text-slate-400">
            Publish and manage announcements for students,
            teachers and administrators.
          </p>
        </div>

        </div>

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      {/* At-Risk Student Monitor */}
      <div className="rounded-xl bg-white/[0.03] shadow mb-8">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              At-Risk Student Monitor
            </h2>

            <p className="text-sm text-slate-400">
              Scan all enrolled students for low attendance, unpaid
              fees and failing grades. At-risk notifications are sent
              automatically.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunAtRiskCheck}
            disabled={atRiskLoading}
            className="rounded-lg bg-amber-500 px-5 py-2.5 font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {atRiskLoading
              ? "Scanning..."
              : atRiskResult
              ? "Re-run Check"
              : "Run At-Risk Check"}
          </button>
        </div>

        {atRiskError && (
          <div className="border-b bg-red-500/10 px-6 py-3 text-red-300">
            {atRiskError}
          </div>
        )}

        {atRiskLoading && (
          <div className="py-10 text-center text-slate-400">
            Scanning students and generating notifications...
          </div>
        )}

        {atRiskResult && !atRiskLoading && (
          <div className="p-6">
            <p className="mb-5 text-sm text-slate-300">
              {atRiskResult.summaryText}
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
              <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-slate-100">
                  {atRiskResult.summary?.totalChecked ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Total Checked
                </p>
              </div>

              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
                <p className="text-2xl font-bold text-red-300">
                  {atRiskResult.summary?.atRiskCount ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  At-Risk Students
                </p>
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                <p className="text-2xl font-bold text-amber-300">
                  {atRiskResult.summary?.attendanceRisk ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Attendance Risks
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-center">
                <p className="text-2xl font-bold text-orange-700">
                  {atRiskResult.summary?.paymentRisk ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Payment Risks
                </p>
              </div>
            </div>

            {atRiskResult.report?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 text-left">
                    <tr className="border-b">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">
                        Student
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">
                        ID
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">
                        Risk Indicators
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-200">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {atRiskResult.report.map((student) => (
                      <tr key={student.studentId} className="hover:bg-white/5">
                        <td className="px-4 py-4 text-sm font-medium text-slate-100">
                          {student.name}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-300">
                          {student.studentIdCode}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {student.reasons.map((reason) => (
                              <span
                                key={reason}
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  reason === "ATTENDANCE"
                                    ? "bg-amber-500/15 text-amber-300"
                                    : reason === "PAYMENT"
                                    ? "bg-red-500/15 text-red-300"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {reason.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-1 text-xs text-slate-300">
                            {student.details?.attendance && (
                              <p>
                                Attendance:{" "}
                                {student.details.attendance.percent}% (
                                {student.details.attendance.attended}/
                                {student.details.attendance.held})
                              </p>
                            )}

                            {student.details?.payments && (
                              <p>
                                Fees due: ৳
                                {student.details.payments.totalDue}
                              </p>
                            )}

                            {student.details?.grades && (
                              <p>
                                Failing courses:{" "}
                                {student.details.grades.failingCount}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-4 text-emerald-300 text-sm">
                No at-risk students detected.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Publish Card */}
      <div className="rounded-xl bg-white/[0.03] shadow mb-8">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              Publish Notice
            </h2>

            <p className="text-sm text-slate-400">
              Send an announcement to a user.
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
            {showForm ? "Cancel" : "+ Publish Notice"}
          </button>
        </div>

        {showForm && (
          <div className="border-b bg-white/5 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Recipient */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Recipient
                  </label>

                  <select
                    value={userId}
                    onChange={(e) =>
                      setUserId(e.target.value)
                    }
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select User</option>

                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.email} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Notice Type
                  </label>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Type</option>

                    {NOTIFICATION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Title
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Midterm Exam Schedule"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Message
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    rows="3"
                    className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Write the notice content..."
                    required
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
                    ? "Publishing..."
                    : "Publish Notice"}
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

        {/* Notifications List */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Total Notices: {notifications.length}
          </p>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices..."
            className="w-64 rounded-lg border border-white/15 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading notices...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No notices found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/5 text-left">
                <tr className="border-b">
                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Recipient
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Type
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Title
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Status
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Date
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-semibold text-slate-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filteredNotifications.map(
                  (notification, index) => (
                    <tr
                      key={notification.id}
                      className="hover:bg-white/5"
                    >
                      <td className="px-5 py-4 text-sm text-slate-300">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {getUserEmail(notification.userId)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeClass(
                            notification.type
                          )}`}
                        >
                          {notification.type.replace(
                            /_/g,
                            " "
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-100">
                          {notification.title}
                        </p>

                        <p className="text-xs text-slate-400 max-w-xs truncate">
                          {notification.message}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {notification.archivedAt ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-200">
                            Archived
                          </span>
                        ) : notification.isRead ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300">
                            Read
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Unread
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {formatDate(notification.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          {notification.archivedAt ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleUnarchive(notification.id)
                              }
                              className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleArchive(notification.id)
                              }
                              className="rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
                            >
                              Archive
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(notification.id)
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
  );
};

export default Notices;
