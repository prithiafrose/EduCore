import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  Award,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  Library,
  LogOut,
  Megaphone,
  NotebookPen,
  PanelLeft,
  PanelLeftClose,
  Presentation,
  ScrollText,
  User,
  UserCog,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

function sidebarData(role) {
  if (role === "ADMIN") {
    return {
      portal: "Admin Portal",
      sections: [
        {
          title: null,
          items: [
            { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
          ],
        },
        {
          title: "Academic Management",
          items: [
            { to: "/admin/departments", label: "Departments", icon: Building2 },
            { to: "/admin/programs", label: "Programs", icon: GraduationCap },
            { to: "/admin/academic-semesters", label: "Semesters", icon: CalendarDays },
            { to: "/admin/courses", label: "Courses", icon: BookOpen },
            { to: "/admin/course-offerings", label: "Course Offerings", icon: Library },
            { to: "/admin/sections", label: "Sections", icon: LayoutGrid },
          ],
        },
        {
          title: "Users",
          items: [
            { to: "/admin/teachers", label: "Teachers", icon: Users },
            { to: "/admin/students", label: "Students", icon: UserRound },
            { to: "/admin/users", label: "Users", icon: UserCog },
          ],
        },
        {
          title: "Academic Operations",
          items: [
            { to: "/admin/enrollments", label: "Enrollments", icon: ClipboardList },
            { to: "/admin/results", label: "Results", icon: Award },
            { to: "/admin/fees", label: "Fees", icon: Wallet },
            { to: "/admin/schedules", label: "Schedules", icon: CalendarClock },
            { to: "/admin/class-sessions", label: "Class Sessions", icon: Presentation },
            { to: "/admin/notices", label: "Notices", icon: Megaphone },
          ],
        },
        {
          title: "Account",
          items: [
            { to: "/admin/change-password", label: "Change Password", icon: KeyRound },
            { to: "/logout", label: "Logout", icon: LogOut },
          ],
        },
      ],
    };
  }

  if (role === "TEACHER") {
    return {
      portal: "Teacher Portal",
      sections: [
        {
          title: null,
          items: [
            { to: "/teacher", label: "Dashboard", icon: LayoutDashboard, exact: true },
          ],
        },
        {
          title: "Teaching",
          items: [
            { to: "/teacher/courses", label: "My Courses", icon: BookOpen },
            { to: "/teacher/routine", label: "Class Routine", icon: CalendarDays },
            { to: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
          ],
        },
        {
          title: "Academic",
          items: [
            { to: "/teacher/assessments", label: "Assessments", icon: ClipboardList },
            { to: "/teacher/assignments", label: "Assignments", icon: NotebookPen },
            { to: "/teacher/exams", label: "Exams", icon: FileText },
            { to: "/teacher/students", label: "Students", icon: Users },
            { to: "/teacher/notices", label: "Notice Board", icon: Megaphone },
          ],
        },
        {
          title: "Account",
          items: [
            { to: "/teacher/profile", label: "Profile", icon: User },
            { to: "/logout", label: "Logout", icon: LogOut },
          ],
        },
      ],
    };
  }

  return {
    portal: "Student Portal",
    sections: [
      {
        title: null,
        items: [
          { to: "/student", label: "Dashboard", icon: LayoutDashboard, exact: true },
        ],
      },
      {
        title: "Main",
        items: [
          { to: "/student/courses", label: "My Courses", icon: BookOpen },
          { to: "/student/assignments", label: "Assignments", icon: NotebookPen },
          { to: "/student/routine", label: "Class Routine", icon: CalendarDays },
          { to: "/student/attendance", label: "Attendance", icon: CalendarCheck },
          { to: "/student/payments", label: "Payments", icon: Wallet },
        ],
      },
      {
        title: "Academic",
        items: [
          { to: "/student/course-registration", label: "Course Registration", icon: ClipboardList },
          { to: "/student/results", label: "Results", icon: Award },
          { to: "/student/transcript", label: "Transcript", icon: ScrollText },
          { to: "/student/notices", label: "Notice Board", icon: Megaphone },
        ],
      },
      {
        title: "Account",
        items: [
          { to: "/student/profile", label: "Profile", icon: User },
          { to: "/logout", label: "Logout", icon: LogOut },
        ],
      },
    ],
  };
}

function Sidebar({ role = "STUDENT", collapsed = false, onToggle }) {
  const data = sidebarData(role);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed left-0 top-0 bottom-0 z-30 bg-slate-900 text-white flex flex-col overflow-hidden"
    >
      <div className="px-4 py-5 border-b border-slate-700/60 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0">
          <GraduationCap size={20} />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          <h1 className="text-xl font-bold tracking-tight whitespace-nowrap">
            EduCore
          </h1>

          <p className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">
            {data.portal}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto nav-scroll">
        {data.sections.map((section, sectionIndex) => {
          const earlierItems = data.sections
            .slice(0, sectionIndex)
            .reduce((sum, sec) => sum + sec.items.length, 0);

          return (
            <div key={section.title || "root"}>
              {section.title && !collapsed && (
                <p className="px-3 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  {section.title}
                </p>
              )}

              {section.items.map((item, itemIndex) => {
                const { to, label, icon: Icon, exact } = item;
                const delay = 0.04 * (earlierItems + itemIndex);

                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.28,
                        ease: "easeOut",
                        delay,
                      },
                    }}
                    whileHover={collapsed ? undefined : { x: 3 }}
                    whileTap={{ scaleY: 0.98 }}
                  >
                    <NavLink
                      to={to}
                      end={exact}
                      title={label}
                      aria-label={label}
                      className={`relative flex items-center h-10 rounded-lg mb-1 text-sm font-medium text-slate-300 transition-colors duration-150 hover:bg-white/5 hover:text-white ${
                        collapsed ? "justify-center px-0 w-full" : "px-3 gap-3"
                      }`}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="nav-active-pill"
                              className="absolute inset-0 rounded-lg bg-white/10"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 32,
                              }}
                            />
                          )}

                          <span className="relative z-10 shrink-0 flex items-center justify-center">
                            <Icon size={18} strokeWidth={2} />
                          </span>

                          <span
                            className={`relative z-10 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                              collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                            }`}
                          >
                            {label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-700/60 shrink-0">
        <button
          type="button"
          onClick={() => onToggle?.()}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center h-10 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-150"
        >
          <span className={`flex items-center ${collapsed ? "justify-center w-full" : "px-3 gap-3"}`}>
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}

            <span
              className={`overflow-hidden transition-all duration-300 ${
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              <span className="text-sm font-medium whitespace-nowrap">Collapse</span>
            </span>
          </span>
        </button>

        {!collapsed && (
          <p className="text-xs text-slate-500 mt-3 px-3 whitespace-nowrap">
            © {new Date().getFullYear()} EduCore
          </p>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;