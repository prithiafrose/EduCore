import { useEffect, useState } from "react";

import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationApi";

import { runAtRiskCheck } from "../../services/aiApi";

function Notices() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [atRiskResult, setAtRiskResult] = useState(null);
  const [atRiskLoading, setAtRiskLoading] = useState(false);
  const [atRiskError, setAtRiskError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  // ----------------------------
  // Load Notifications
  // ----------------------------
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      if (!storedUser?.id) {
        setError("User information not found.");
        return;
      }

      const response =
        await getNotificationsByUser(storedUser.id);

      const list = Array.isArray(response)
        ? response
        : response?.data || [];

      setNotifications(list);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load notices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadNotifications();
    };

    fetchData();
  }, []);

  // ----------------------------
  // Mark as read
  // ----------------------------
  const handleMarkRead = async (id) => {
    try {
      setError("");
      setSuccess("");

      await markNotificationAsRead(id);

      await loadNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update notice."
      );
    }
  };

  // ----------------------------
  // Mark all as read
  // ----------------------------
  const handleMarkAllRead = async () => {
    try {
      setError("");
      setSuccess("");

      await markAllNotificationsAsRead(storedUser.id);

      setSuccess("All notices marked as read.");

      await loadNotifications();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update notices."
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

      setAtRiskResult(response?.data || null);

      await loadNotifications();
    } catch (err) {
      console.error(err);

      setAtRiskError(
        err.response?.data?.message ||
          "Failed to run at-risk check."
      );
    } finally {
      setAtRiskLoading(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

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

  return (
    <>
        <header className="bg-white/[0.03] border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Teacher Portal
            </p>

            <h2 className="text-2xl font-bold text-slate-100">
              Notice Board
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Announcements and notices for you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
              {unreadCount} unread
            </span>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-white/10"
              >
                Mark All Read
              </button>
            )}
          </div>
        </header>

        <div className="p-8">
          {/* At-Risk Student Monitor */}
          <div className="bg-white/[0.03] rounded-xl border border-white/10 shadow-sm mb-6">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  At-Risk Student Monitor
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Scan students in your assigned courses for low
                  attendance, unpaid fees and failing grades.
                  Notifications are sent automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAtRiskCheck}
                disabled={atRiskLoading}
                className="whitespace-nowrap px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {atRiskLoading
                  ? "Scanning..."
                  : atRiskResult
                  ? "Re-run Check"
                  : "Run At-Risk Check"}
              </button>
            </div>

            {atRiskError && (
              <div className="border-b border-white/10 bg-red-500/10 px-6 py-3 text-red-300">
                {atRiskError}
              </div>
            )}

            {atRiskLoading && (
              <div className="py-10 text-center text-slate-500">
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
                    <p className="text-xs text-slate-500 mt-1">
                      Total Checked
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-red-300">
                      {atRiskResult.summary?.atRiskCount ?? 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      At-Risk Students
                    </p>
                  </div>

                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-300">
                      {atRiskResult.summary?.attendanceRisk ?? 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Attendance Risks
                    </p>
                  </div>

                  <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-center">
                    <p className="text-2xl font-bold text-orange-700">
                      {atRiskResult.summary?.paymentRisk ?? 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Payment Risks
                    </p>
                  </div>
                </div>

                {atRiskResult.report?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 text-left">
                        <tr className="border-b border-white/10">
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
                    No at-risk students in your courses.
                  </div>
                )}
              </div>
            )}
          </div>

          {loading && (
            <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center">
              <p className="text-slate-500">
                Loading notices...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white/[0.03] rounded-xl border border-red-500/20 p-6">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {!loading && !error && (
            <>
              {notifications.length === 0 ? (
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center">
                  <div className="text-4xl mb-3">📣</div>

                  <h3 className="text-lg font-semibold text-slate-200">
                    No Notices
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    You have no notices at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white/[0.03] rounded-xl border p-6 ${
                        notification.isRead
                          ? "border-white/10"
                          : "border-blue-300 ring-1 ring-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
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

                            {!notification.isRead && (
                              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                New
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-slate-100">
                            {notification.title}
                          </h3>

                          <p className="text-slate-300 mt-1">
                            {notification.message}
                          </p>

                          <p className="text-xs text-slate-500 mt-3">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkRead(notification.id)
                            }
                            className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
    </>
  );
}

export default Notices;