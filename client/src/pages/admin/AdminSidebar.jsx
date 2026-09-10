import { Link } from "react-router-dom";

const navLink = (icon, label, to, active) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 ${
            active
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
    >
        <span>{icon}</span>
        {label}
    </Link>
);

const sectionTitle = (title) => (
    <p className="px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
    </p>
);

function AdminSidebar({ current }) {
    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 bottom-0">
            <div className="px-6 py-5 border-b border-slate-700">
                <h1 className="text-2xl font-bold">
                    EduCore
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                    Admin Portal
                </p>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                {navLink("⌂", "Dashboard", "/admin", current === "dashboard")}
                {sectionTitle("Academic Management")}
                {navLink("▦", "Departments", "/admin/departments", current === "departments")}
                {navLink("◈", "Programs", "/admin/programs", current === "programs")}
                {navLink("◷", "Semesters", "/admin/academic-semesters", current === "semesters")}
                {navLink("▤", "Courses", "/admin/courses", current === "courses")}
                {navLink("▣", "Course Offerings", "/admin/course-offerings", current === "offerings")}
                {navLink("⊞", "Sections", "/admin/sections", current === "sections")}
                {sectionTitle("Users")}
                {navLink("♙", "Teachers", "/admin/teachers", current === "teachers")}
                {navLink("♙", "Students", "/admin/students", current === "students")}
                {navLink("◎", "Users", "/admin/users", current === "users")}
                {sectionTitle("Academic Operations")}
                {navLink("◎", "Enrollments", "/admin/enrollments", current === "enrollments")}
                {navLink("◉", "Results", "/admin/results", current === "results")}
                {navLink("₨", "Fees", "/admin/fees", current === "fees")}
                {navLink("◷", "Schedules", "/admin/schedules", current === "schedules")}
                {navLink("▤", "Class Sessions", "/admin/class-sessions", current === "class-sessions")}
                {navLink("▣", "Notices", "/admin/notices", current === "notices")}
                {sectionTitle("Account")}
                {navLink("🔑", "Change Password", "/admin/change-password", current === "change-password")}
                {navLink("↪", "Logout", "/logout", false)}
            </nav>
        </aside>
    );
}

export default AdminSidebar;