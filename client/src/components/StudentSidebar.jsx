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

function StudentSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 bottom-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold">EduCore</h1>

        <p className="text-sm text-slate-400 mt-1">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {navLink("⌂", "Dashboard", "/student", true)}
        {sectionTitle("Main")}
        {navLink("▤", "My Courses", "/student/courses")}
        {navLink("✎", "Assignments", "/student/assignments")}
        {navLink("◫", "Class Routine", "/student/routine")}
        {navLink("✓", "Attendance", "/student/attendance")}
        {navLink("₨", "Payments", "/student/payments")}
        {sectionTitle("Academic")}
        {navLink("✎", "Course Registration", "/student/course-registration")}
        {navLink("◈", "Results", "/student/results")}
        {navLink("▩", "Transcript", "/student/transcript")}
        {navLink("▣", "Notice Board", "/student/notices")}
        {sectionTitle("Account")}
        {navLink("◉", "Profile", "/student/profile")}
        {navLink("↪", "Logout", "/logout")}
      </nav>
    </aside>
  );
}

export default StudentSidebar;