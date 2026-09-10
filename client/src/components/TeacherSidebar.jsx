import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-3 rounded-lg mb-1 ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const sectionTitle = (title) => (
  <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
    {title}
  </p>
);

const navLink = (icon, label, to, end) => (
  <NavLink key={to} to={to} end={end} className={linkStyle}>
    <span>{icon}</span>
    {label}
  </NavLink>
);

function TeacherSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 bottom-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold">EduCore</h1>

        <p className="text-sm text-slate-400 mt-1">
          Teacher Portal
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {navLink("⌂", "Dashboard", "/teacher", true)}
        {sectionTitle("Teaching")}
        {navLink("▤", "My Courses", "/teacher/courses")}
        {navLink("◷", "Class Routine", "/teacher/routine")}
        {navLink("✓", "Attendance", "/teacher/attendance")}
        {sectionTitle("Academic")}
        {navLink("✓", "Assessments", "/teacher/assessments")}
        {navLink("✎", "Assignments", "/teacher/assignments")}
        {navLink("▣", "Exams", "/teacher/exams")}
        {navLink("●", "Students", "/teacher/students")}
        {navLink("▣", "Notice Board", "/teacher/notices")}
        {sectionTitle("Account")}
        {navLink("◉", "Profile", "/teacher/profile")}
        {navLink("↪", "Logout", "/logout")}
      </nav>
    </aside>
  );
}

export default TeacherSidebar;