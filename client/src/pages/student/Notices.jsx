import { useEffect, useState } from "react";

import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationApi";

function Notices() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storedUser = JSON.parse(
    localStorage.getItem("user")
  );

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
    let ignore = false;

    const fetchData = async () => {
      if (!ignore) {
        await loadNotifications();
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
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
  // Helpers
  // ----------------------------
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
              Student Portal
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
                            {formatDate(
                              notification.createdAt
                            )}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkRead(
                                notification.id
                              )
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