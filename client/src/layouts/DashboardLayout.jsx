import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/ui/TopBar";
import PageTransition from "../components/ui/PageTransition";
import {
  getNotificationsByUser,
  markAllNotificationsAsRead,
} from "../services/notificationApi";

const roleMeta = {
  ADMIN: { portal: "Admin", label: "Administrator", base: "/admin" },
  TEACHER: { portal: "Teacher", label: "Teacher", base: "/teacher" },
  STUDENT: { portal: "Student", label: "Student", base: "/student" },
};

const routeMeta = {
  "/admin": { title: "Admin Dashboard" },
  "/admin/departments": { title: "Departments", crumb: "Academic Management" },
  "/admin/programs": { title: "Programs", crumb: "Academic Management" },
  "/admin/academic-semesters": { title: "Academic Semesters", crumb: "Academic Management" },
  "/admin/courses": { title: "Courses", crumb: "Academic Management" },
  "/admin/course-offerings": { title: "Course Offerings", crumb: "Academic Management" },
  "/admin/sections": { title: "Sections", crumb: "Academic Management" },
  "/admin/teachers": { title: "Teachers", crumb: "Users" },
  "/admin/students": { title: "Students", crumb: "Users" },
  "/admin/users": { title: "Users", crumb: "Users" },
  "/admin/enrollments": { title: "Enrollments", crumb: "Academic Operations" },
  "/admin/results": { title: "Results", crumb: "Academic Operations" },
  "/admin/fees": { title: "Fees", crumb: "Academic Operations" },
  "/admin/schedules": { title: "Schedules", crumb: "Academic Operations" },
  "/admin/class-sessions": { title: "Class Sessions", crumb: "Academic Operations" },
  "/admin/notices": { title: "Notices", crumb: "Academic Operations" },
  "/admin/change-password": { title: "Change Password", crumb: "Account" },
  "/teacher": { title: "Teacher Dashboard" },
  "/teacher/courses": { title: "My Courses", crumb: "Teaching" },
  "/teacher/routine": { title: "Class Routine", crumb: "Teaching" },
  "/teacher/attendance": { title: "Attendance", crumb: "Teaching" },
  "/teacher/assessments": { title: "Assessments", crumb: "Academic" },
  "/teacher/assignments": { title: "Assignments", crumb: "Academic" },
  "/teacher/exams": { title: "Exams", crumb: "Academic" },
  "/teacher/students": { title: "Students", crumb: "Academic" },
  "/teacher/notices": { title: "Notice Board", crumb: "Academic" },
  "/teacher/profile": { title: "Profile", crumb: "Account" },
  "/student": { title: "Student Dashboard" },
  "/student/courses": { title: "My Courses", crumb: "Main" },
  "/student/assignments": { title: "Assignments", crumb: "Main" },
  "/student/routine": { title: "Class Routine", crumb: "Main" },
  "/student/attendance": { title: "Attendance", crumb: "Main" },
  "/student/payments": { title: "Payments", crumb: "Main" },
  "/student/course-registration": { title: "Course Registration", crumb: "Academic" },
  "/student/results": { title: "Results", crumb: "Academic" },
  "/student/transcript": { title: "Transcript", crumb: "Academic" },
  "/student/notices": { title: "Notice Board", crumb: "Academic" },
  "/student/profile": { title: "Profile", crumb: "Account" },
};

function prettify(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function DashboardLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const meta = roleMeta[user?.role] || roleMeta.STUDENT;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getNotificationsByUser(user?.id);
        const list = Array.isArray(response)
          ? response
          : response?.data || [];

        setNotifications(list);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    if (user?.id) {
      loadNotifications();
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleMarkAllRead = async () => {
    if (!user?.id) return;

    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const unread = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const pageMeta = routeMeta[location.pathname] || {
    title: prettify(
      location.pathname.split("/").filter(Boolean).pop() || "Dashboard"
    ),
  };

  const initial = (user?.email || meta?.label || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none educore-gradient" />
      <div className="relative">
        <div className="hidden lg:block">
        <Sidebar
          role={user?.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Sidebar role={user?.role} />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="absolute top-5 right-3 w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition z-10"
              >
                <X size={16} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div
        className={`lg:transition-[margin] lg:duration-300 lg:ease-out ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        }`}
      >
        <TopBar
          portal={meta.portal}
          pageTitle={pageMeta.title}
          crumb={pageMeta.crumb}
          role={meta.label}
          initial={initial}
          email={user?.email || ""}
          onMenuClick={() => setMobileOpen((open) => !open)}
          notifications={notifications}
          unread={unread}
          onMarkAllRead={handleMarkAllRead}
        />

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
      </div>
    </div>
  );
}

export default DashboardLayout;