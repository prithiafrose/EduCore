function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">EduCore</h1>

        <nav className="space-y-2">
          <a href="/admin" className="block px-4 py-3 rounded-lg bg-gray-700">
            Dashboard
          </a>

          <a
  href="/admin/departments"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Departments
</a>

          <a
  href="/admin/programs"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Programs
</a>

          <a
  href="/admin/semesters"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Semesters
</a>

          <a
  href="/admin/courses"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Courses
          </a>

          <a
  href="/admin/teachers"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Teachers
</a>

          <a
  href="/admin/students"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Students
</a>

          <a
  href="/admin/enrollments"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Enrollments
</a>

          <a
  href="/admin/assessments"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Assessments
</a>

          <a
  href="/admin/exams"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Exams
</a>

          <a
  href="/admin/results"
  className="block px-4 py-3 rounded-lg hover:bg-gray-700"
>
  Results
</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h2>
            <p className="text-gray-500 mt-1">
              Welcome back to EduCore
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Admin
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Students</p>
            <h3 className="text-3xl font-bold mt-2">120</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Teachers</p>
            <h3 className="text-3xl font-bold mt-2">35</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Courses</p>
            <h3 className="text-3xl font-bold mt-2">48</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Departments</p>
            <h3 className="text-3xl font-bold mt-2">8</h3>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl shadow mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>

          <p className="text-gray-500">
            No recent activity yet.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;