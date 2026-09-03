
import { useEffect, useState } from "react";
import api from "../../services/axios";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    departments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin");

        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 shadow-xl">

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            EduCore
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            University Management System
          </p>
        </div>

        <nav className="space-y-1">

          {/* Dashboard */}
          <a
            href="/admin"
            className="flex items-center px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-sm"
          >
            <span className="mr-3 text-sm">⌂</span>
            Dashboard
          </a>

          {/* Academic Management */}
          <div className="pt-5 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Management
            </p>
          </div>

          <a
            href="/admin/departments"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">▦</span>
            Departments
          </a>

          <a
            href="/admin/programs"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">◈</span>
            Programs
          </a>

          <a
            href="/admin/academic-semesters"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">◷</span>
            Semesters
          </a>

          <a
            href="/admin/courses"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">▤</span>
            Courses
          </a>

          <a
            href="/admin/course-offerings"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">▣</span>
            Course Offerings
          </a>

          {/* Users */}
          <div className="pt-5 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Users
            </p>
          </div>

          <a
            href="/admin/teachers"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">♙</span>
            Teachers
          </a>

          <a
            href="/admin/students"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">♙</span>
            Students
          </a>

          {/* Academic Operations */}
          <div className="pt-5 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Operations
            </p>
          </div>

          <a
            href="/admin/enrollments"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">◎</span>
            Enrollments
          </a>

          <a
            href="/admin/assessments"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">✓</span>
            Assessments
          </a>

          <a
            href="/admin/exams"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">▣</span>
            Exams
          </a>

          <a
            href="/admin/results"
            className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="mr-3 text-sm">◉</span>
            Results
          </a>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-8 py-5">

          <div className="flex justify-between items-center">

            <div>
              <p className="text-sm font-medium text-indigo-600 mb-1">
                Admin Portal
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Admin Dashboard
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Welcome back to EduCore
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden sm:block bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg">
                <p className="text-xs text-slate-400">
                  Role
                </p>

                <p className="text-sm font-semibold text-slate-700">
                  Administrator
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                A
              </div>

            </div>
          </div>

        </header>

        {/* Dashboard Body */}
        <div className="p-8">

          {/* Overview Heading */}
          <div className="mb-5">

            <h3 className="text-lg font-semibold text-slate-900">
              System Overview
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Key statistics from the university management system.
            </p>

          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Students */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Students
                  </p>

                  {loading ? (
                    <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                  ) : (
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.students}
                    </h3>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    Registered students
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                  ♙
                </div>

              </div>

            </div>

            {/* Teachers */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Teachers
                  </p>

                  {loading ? (
                    <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                  ) : (
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.teachers}
                    </h3>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    Faculty members
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  ♙
                </div>

              </div>

            </div>

            {/* Courses */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Courses
                  </p>

                  {loading ? (
                    <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                  ) : (
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.courses}
                    </h3>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    Available courses
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                  ▤
                </div>

              </div>

            </div>

            {/* Departments */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Departments
                  </p>

                  {loading ? (
                    <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                  ) : (
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.departments}
                    </h3>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    Academic departments
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                  ▦
                </div>

              </div>

            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">

            <div className="px-6 py-5 border-b border-slate-200">

              <h3 className="text-xl font-semibold text-slate-900">
                Recent Activity
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Latest administrative activity in EduCore.
              </p>

            </div>

            <div className="p-6">

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  i
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    No recent activity yet.
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Administrative activities will appear here.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;

