import { useEffect, useState } from "react";
import api from "../../services/axios";
import AdminSidebar from "./AdminSidebar";

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    departments: 0,
  });

  const [revenue, setRevenue] = useState({
    collected: 0,
    outstanding: 0,
    paidCount: 0,
    pendingCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, revenueResponse] = await Promise.all([
          api.get("/admin"),
          api.get("/admin/revenue"),
        ]);

        setStats(statsResponse.data.data);

        setRevenue(revenueResponse.data.data);
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
      <AdminSidebar current="dashboard" />

      {/* Main Content */}
      <main className="ml-64 flex-1 min-w-0">

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

          {/* Revenue Overview */}
          <div className="mt-8">

            <div className="mb-5">

              <h3 className="text-lg font-semibold text-slate-900">
                Revenue Overview
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Fee collection and payment statistics.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              {/* Total Collected */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Collected
                    </p>

                    {loading ? (
                      <div className="h-9 w-20 bg-slate-200 rounded mt-2 animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        ৳{(revenue.collected || 0).toLocaleString()}
                      </h3>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      BDT collected
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
                    ৳
                  </div>

                </div>

              </div>

              {/* Outstanding */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Outstanding
                    </p>

                    {loading ? (
                      <div className="h-9 w-20 bg-slate-200 rounded mt-2 animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        ৳{(revenue.outstanding || 0).toLocaleString()}
                      </h3>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      BDT pending
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                    ৳
                  </div>

                </div>

              </div>

              {/* Paid Count */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Paid Count
                    </p>

                    {loading ? (
                      <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        {revenue.paidCount || 0}
                      </h3>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      Paid payments
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    ✓
                  </div>

                </div>

              </div>

              {/* Pending Count */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition">

                <div className="flex justify-between items-start">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Pending Count
                    </p>

                    {loading ? (
                      <div className="h-9 w-16 bg-slate-200 rounded mt-2 animate-pulse" />
                    ) : (
                      <h3 className="text-3xl font-bold text-slate-900 mt-2">
                        {revenue.pendingCount || 0}
                      </h3>
                    )}

                    <p className="text-xs text-slate-400 mt-2">
                      Pending payments
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg">
                    !
                  </div>

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
