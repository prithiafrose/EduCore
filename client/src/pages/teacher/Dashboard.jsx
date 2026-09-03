import { Link } from "react-router-dom";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

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
                    <Link
                        to="/teacher"
                        className="flex items-center px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-sm"
                    >
                        <span className="mr-3 text-sm">⌂</span>
                        Dashboard
                    </Link>

                    {/* Teaching */}
                    <div className="pt-5 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Teaching
                        </p>
                    </div>

                    <Link
                        to="/teacher/courses"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">▤</span>
                        My Courses
                    </Link>

                    <Link
                        to="/teacher/routine"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">◷</span>
                        Class Routine
                    </Link>

                    <Link
                        to="/teacher/attendance"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">✓</span>
                        Attendance
                    </Link>

                    {/* Academic */}
                    <div className="pt-5 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Academic
                        </p>
                    </div>

                    <Link
                        to="/teacher/assessments"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">✓</span>
                        Assessments
                    </Link>

                    <Link
                        to="/teacher/exams"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">▣</span>
                        Exams
                    </Link>

                    <Link
                        to="/teacher/students"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">♙</span>
                        Students
                    </Link>

                    {/* Account */}
                    <div className="pt-5 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Account
                        </p>
                    </div>

                    <Link
                        to="/teacher/profile"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">●</span>
                        Profile
                    </Link>

                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 px-8 py-5">

                    <div className="flex justify-between items-center">

                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">
                                Teacher Portal
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                Teacher Dashboard
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
                                    Teacher
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                                {user?.email
                                    ? user.email.charAt(0).toUpperCase()
                                    : "T"}
                            </div>

                        </div>
                    </div>

                </header>

                {/* Dashboard Body */}
                <div className="p-8">

                    {/* Welcome */}
                    <div className="mb-8">

                        <h3 className="text-lg font-semibold text-slate-900">
                            Teaching Overview
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            Manage your courses, classes, attendance and academic activities.
                        </p>

                    </div>

                    {/* Quick Access Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                        {/* Courses */}
                        <Link
                            to="/teacher/courses"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        My Courses
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                        View
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Courses assigned to you
                                    </p>
                                </div>

                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                                    ▤
                                </div>

                            </div>
                        </Link>

                        {/* Routine */}
                        <Link
                            to="/teacher/routine"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Class Routine
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                        View
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Your scheduled classes
                                    </p>
                                </div>

                                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                                    ◷
                                </div>

                            </div>
                        </Link>

                        {/* Attendance */}
                        <Link
                            to="/teacher/attendance"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Attendance
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                        Manage
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Record student attendance
                                    </p>
                                </div>

                                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                                    ✓
                                </div>

                            </div>
                        </Link>

                        {/* Students */}
                        <Link
                            to="/teacher/students"
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Students
                                    </p>

                                    <h3 className="text-2xl font-bold text-slate-900 mt-2">
                                        View
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Students in your courses
                                    </p>
                                </div>

                                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                                    ♙
                                </div>

                            </div>
                        </Link>

                    </div>

                    {/* Academic Management */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">

                        <div className="px-6 py-5 border-b border-slate-200">

                            <h3 className="text-xl font-semibold text-slate-900">
                                Academic Management
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage student assessment and examination activities.
                            </p>

                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Assessments */}
                            <Link
                                to="/teacher/assessments"
                                className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition"
                            >
                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        ✓
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-800">
                                            Assessments
                                        </h4>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Enter and manage student assessment marks.
                                        </p>
                                    </div>

                                </div>
                            </Link>

                            {/* Exams */}
                            <Link
                                to="/teacher/exams"
                                className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition"
                            >
                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        ▣
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-800">
                                            Exams
                                        </h4>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Manage examination marks and results.
                                        </p>
                                    </div>

                                </div>
                            </Link>

                        </div>

                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">

                        <div className="px-6 py-5 border-b border-slate-200">

                            <h3 className="text-xl font-semibold text-slate-900">
                                Recent Activity
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Your latest teaching activities will appear here.
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
                                        Your teaching activities will appear here.
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