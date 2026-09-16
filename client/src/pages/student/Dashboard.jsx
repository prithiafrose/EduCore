import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import StatCard from "../../components/ui/StatCard";
import AnimatedCard from "../../components/ui/AnimatedCard";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import ProgressRing from "../../components/ui/ProgressRing";

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
    <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="▤"
                  label="Enrolled Courses"
                  value={stats.courses}
                  hint="Courses you are enrolled in"
                  accent="indigo"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="◈"
                  label="Total Credit Hours"
                  value={stats.credits}
                  hint="Credits across enrolled courses"
                  accent="purple"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="✓"
                  label="Attendance"
                  value={stats.attendance}
                  suffix="%"
                  hint="Overall attendance in finished classes"
                  accent="emerald"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="₨"
                  label="Pending Payments"
                  value={stats.pendingPayments}
                  hint="Unpaid fees or invoices"
                  accent="amber"
                  loading={loading}
                />
              </SpotlightCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-8">
              <AnimatedCard className="lg:col-span-1 p-6" hover={false}>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Attendance
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Your overall class attendance
                  </p>
                </div>

                <div className="flex justify-center">
                  <ProgressRing
                    value={stats.attendance}
                    size={132}
                    strokeWidth={10}
                    color="#10b981"
                    label="Overall attendance"
                  />
                </div>
              </AnimatedCard>

              <AnimatedCard
                className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 border-transparent p-6"
                hover={false}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Quick Actions
                  </h3>

                  <p className="text-sm text-indigo-100 mt-1">
                    Jump into your most used sections
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { to: "/student/courses", icon: "▤", label: "My Courses" },
                    { to: "/student/assignments", icon: "✎", label: "Assignments" },
                    { to: "/student/routine", icon: "◫", label: "Class Routine" },
                    { to: "/student/course-registration", icon: "✎", label: "Register Courses" },
                  ].map((action, index) => (
                    <motion.div
                      key={action.to}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.07 }}
                      whileHover={{ y: -2 }}
                    >
                      <Link
                        to={action.to}
                        className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white hover:bg-white/10 transition"
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className="text-sm font-medium">
                          {action.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            <AnimatedCard className="mt-8" hover={false}>
              <div className="px-6 py-5 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">
                  Latest Notices
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your recent unread announcements
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">
                  Loading notices...
                </div>
              ) : notices.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-slate-500 text-sm">
                    You have no unread notices.
                  </p>

                  <Link
                    to="/student/notices"
                    className="mt-3 inline-block text-blue-400 text-sm font-medium hover:underline"
                  >
                    View Notice Board →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="px-6 py-4 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-100 truncate">
                          {notice.title}
                        </p>

                        <p className="text-sm text-slate-500 mt-0.5 truncate">
                          {notice.message}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(notice.createdAt)}
                        </p>
                      </div>

                      <Link
                        to="/student/notices"
                        className="shrink-0 text-blue-400 text-sm font-medium hover:underline"
                      >
                        Open
                      </Link>
                    </div>
                  ))}

                  <Link
                    to="/student/notices"
                    className="block px-6 py-3 text-center text-blue-400 text-sm font-medium hover:underline"
                  >
                    View all notices
                  </Link>
                </div>
              )}
            </AnimatedCard>
          </div>
  );
}

export default StudentDashboard;