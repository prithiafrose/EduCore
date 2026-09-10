import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentSidebar from "../../components/StudentSidebar";

import { getStudentByUserId } from "../../services/studentApi";
import { getEnrollmentsByStudentId } from "../../services/enrollmentApi";
import { getAttendancesByStudentId } from "../../services/attendanceApi";
import { getPaymentsByStudent } from "../../services/studentPaymentApi";
import { getNotificationsByUser } from "../../services/notificationApi";

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    courses: 0,
    credits: 0,
    attendance: 0,
    pendingPayments: 0,
  });

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const currentStudent = await getStudentByUserId(user?.id);

        if (!currentStudent) return;

        const enrollmentResponse =
          await getEnrollmentsByStudentId(currentStudent.id);

        const enrollments = Array.isArray(enrollmentResponse)
          ? enrollmentResponse
          : enrollmentResponse?.data || [];

        const credits = enrollments.reduce(
          (sum, enrollment) =>
            sum +
            (enrollment.courseOffering?.course?.creditHours ||
              0),
          0
        );

        setStats((prev) => ({
          ...prev,
          courses: enrollments.length,
          credits,
        }));

        const [attendanceResponse, paymentResponse] =
          await Promise.all([
            getAttendancesByStudentId(currentStudent.id),
            getPaymentsByStudent(currentStudent.id),
          ]);

        const attendance = Array.isArray(attendanceResponse)
          ? attendanceResponse
          : attendanceResponse?.data || [];

        const payments = Array.isArray(paymentResponse)
          ? paymentResponse
          : paymentResponse?.data || [];

        let totalClasses = 0;
        let attendedClasses = 0;

        attendance.forEach((record) => {
          if (record.classSession?.status !== "FINISHED") {
            return;
          }

          totalClasses += 1;

          if (
            record.status === "PRESENT" ||
            record.status === "LATE"
          ) {
            attendedClasses += 1;
          }
        });

        const attendancePct = totalClasses
          ? Math.round((attendedClasses / totalClasses) * 100)
          : 0;

        const pendingPayments = payments.filter(
          (payment) => payment.status !== "PAID"
        ).length;

        setStats((prev) => ({
          ...prev,
          attendance: attendancePct,
          pendingPayments,
        }));
      } catch (error) {
        console.error(
          "Failed to load student dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const loadNotices = async () => {
      try {
        const noticeResponse = await getNotificationsByUser(
          user?.id
        );

        const notifications = Array.isArray(noticeResponse)
          ? noticeResponse
          : noticeResponse?.data || [];

        setNotices(
          notifications
            .filter((notification) => !notification.isRead)
            .slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Failed to load student notices:",
          error
        );
      }
    };

    loadNotices();
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Student Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome back, {user?.email || "Student"} 👋
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Enrolled Courses
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? (
                <span className="animate-pulse text-slate-300">
                  —
                </span>
              ) : (
                stats.courses
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Courses you are enrolled in
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Total Credit Hours
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? (
                <span className="animate-pulse text-slate-300">
                  —
                </span>
              ) : (
                stats.credits
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Credits across enrolled courses
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Attendance
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? (
                <span className="animate-pulse text-slate-300">
                  —
                </span>
              ) : (
                `${stats.attendance}%`
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Overall attendance in finished classes
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Pending Payments
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {loading ? (
                <span className="animate-pulse text-slate-300">
                  —
                </span>
              ) : (
                stats.pendingPayments
              )}
            </h2>

            <p className="text-xs text-slate-400 mt-2">
              Unpaid fees or invoices
            </p>
          </div>
        </div>

        {/* Latest Notices */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Latest Notices
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your recent unread announcements
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading notices...
            </div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm">
                You have no unread notices.
              </p>

              <Link
                to="/student/notices"
                className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline"
              >
                View Notice Board →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="px-6 py-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 truncate">
                      {notice.title}
                    </p>

                    <p className="text-sm text-slate-500 mt-0.5 truncate">
                      {notice.message}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(notice.createdAt)}
                    </p>
                  </div>

                  <Link
                    to="/student/notices"
                    className="shrink-0 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Open
                  </Link>
                </div>
              ))}

              <Link
                to="/student/notices"
                className="block px-6 py-3 text-center text-blue-600 text-sm font-medium hover:underline"
              >
                View all notices
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;