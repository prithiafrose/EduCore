import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TeacherSidebar from "../../components/TeacherSidebar";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";
import { getEnrollments } from "../../services/enrollmentApi";
import { getAllClassSessions } from "../../services/classSessionApi";
import { getAllAssignments } from "../../services/assignmentApi";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [courses, setCourses] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [sessionCount, setSessionCount] = useState(0);
    const [todaySessions, setTodaySessions] = useState([]);
    const [assignmentCount, setAssignmentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedUser = JSON.parse(
                    localStorage.getItem("user")
                );

                const [
                    assignmentsResponse,
                    enrollmentsResponse,
                    sessionsResponse,
                    allAssignmentsResponse,
                ] = await Promise.all([
                    getAllTeacherAssignments(),
                    getEnrollments(),
                    getAllClassSessions(),
                    getAllAssignments(),
                ]);

                const teacherCourses = (
                    Array.isArray(assignmentsResponse)
                        ? assignmentsResponse
                        : assignmentsResponse?.data || []
                ).filter(
                    (assignment) =>
                        Number(
                            assignment.teacher?.userId
                        ) === Number(storedUser?.id)
                );

                setCourses(teacherCourses);

                const offeringIds = new Set(
                    teacherCourses.map((c) =>
                        Number(c.courseOfferingId)
                    )
                );

                const allEnrollments =
                    Array.isArray(enrollmentsResponse)
                        ? enrollmentsResponse
                        : enrollmentsResponse?.data || [];

                setStudentCount(
                    new Set(
                        allEnrollments
                            .filter((e) =>
                                offeringIds.has(
                                    Number(e.courseOfferingId)
                                )
                            )
                            .map((e) => Number(e.studentId))
                    ).size
                );

                const allSessions =
                    Array.isArray(sessionsResponse)
                        ? sessionsResponse
                        : sessionsResponse?.data || [];

                const teacherSessions = allSessions.filter(
                    (s) =>
                        offeringIds.has(
                            Number(s.courseOfferingId)
                        )
                );

                setSessionCount(
                    teacherSessions.filter(
                        (s) => s.status !== "CANCELLED"
                    ).length
                );

                const now = new Date();
                const todayString = `${now.getFullYear()}-${String(
                    now.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    now.getDate()
                ).padStart(2, "0")}`;

                setTodaySessions(
                    teacherSessions
                        .filter(
                            (s) =>
                                s.status !== "CANCELLED" &&
                                (s.date || "").slice(0, 10) ===
                                    todayString
                        )
                        .sort(
                            (a, b) =>
                                new Date(a.startTime) -
                                new Date(b.startTime)
                        )
                );

                const allAssignmentsList =
                    Array.isArray(allAssignmentsResponse)
                        ? allAssignmentsResponse
                        : allAssignmentsResponse?.data || [];

                setAssignmentCount(
                    allAssignmentsList.filter((a) =>
                        offeringIds.has(
                            Number(a.courseOfferingId)
                        )
                    ).length
                );
            } catch (error) {
                console.error(
                    "Failed to load dashboard data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatTime = (time) => {
        if (!time) return "--:--";

        return new Date(time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}
            <TeacherSidebar />

            {/* Main Content */}
            <main className="ml-64 flex-1 min-w-0">

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
                                        {loading ? "…" : courses.length}
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
                                        {loading ? "…" : sessionCount}
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Scheduled classes
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
                                        {loading ? "…" : todaySessions.length}
                                    </h3>

                                    <p className="text-xs text-slate-400 mt-2">
                                        Classes today
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
                                        {loading ? "…" : studentCount}
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

                            {/* Assignments */}
                            <Link
                                to="/teacher/assignments"
                                className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-sm transition"
                            >
                                <div className="flex items-center gap-4">

                                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        ✎
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-800">
                                            Assignments
                                        </h4>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {loading
                                                ? "Loading..."
                                                : `${assignmentCount} active assignment${
                                                      assignmentCount === 1
                                                          ? ""
                                                          : "s"
                                                  } in your courses.`}
                                        </p>
                                    </div>

                                </div>
                            </Link>

                        </div>

                    </div>

                    {/* Today's Classes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">

                        <div className="px-6 py-5 border-b border-slate-200">

                            <h3 className="text-xl font-semibold text-slate-900">
                                Today's Classes
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                {loading
                                    ? "Loading your schedule..."
                                    : todaySessions.length === 0
                                    ? "You have no classes scheduled today."
                                    : `${todaySessions.length} class${
                                          todaySessions.length === 1 ? "" : "es"
                                      } scheduled today.`}
                            </p>

                        </div>

                        <div className="p-6">
                            {loading ? (
                                <p className="text-sm text-slate-500">
                                    Loading your schedule...
                                </p>
                            ) : todaySessions.length === 0 ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        i
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-slate-700">
                                            No classes today.
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Check your class routine for upcoming sessions.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {todaySessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                                                    ◷
                                                </div>

                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {session.courseOffering
                                                            ?.course?.code ||
                                                            "Course"}
                                                    </p>

                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {session.courseOffering
                                                            ?.course?.name || "N/A"}
                                                        {session.room
                                                            ? ` · Room ${session.room}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {formatTime(
                                                        session.startTime
                                                    )}
                                                    {" - "}
                                                    {formatTime(
                                                        session.endTime
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;