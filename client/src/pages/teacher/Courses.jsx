import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getAllTeacherAssignments
} from "../../services/teacherAssignmentApi";

function TeacherCourses() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = JSON.parse(
                    localStorage.getItem("user")
                );

                if (!user?.id) {
                    setError("User information not found");
                    return;
                }

                const data =
                    await getAllTeacherAssignments();

                const teacherAssignments = data.filter(
                    (assignment) =>
                        assignment.teacher?.userId === user.id
                );

                setAssignments(teacherAssignments);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex">

                <aside className="w-64 bg-slate-900 text-white p-6 shadow-xl">
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold tracking-tight">
                            EduCore
                        </h1>

                        <p className="text-xs text-slate-400 mt-1">
                            University Management System
                        </p>
                    </div>
                </aside>

                <main className="flex-1 p-8">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8">
                        <p className="text-slate-500">
                            Loading courses...
                        </p>
                    </div>
                </main>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 flex">

                <aside className="w-64 bg-slate-900 text-white p-6 shadow-xl">
                    <h1 className="text-2xl font-bold">
                        EduCore
                    </h1>
                </aside>

                <main className="flex-1 p-8">
                    <div className="bg-white rounded-2xl border border-red-200 p-8">
                        <h2 className="text-xl font-semibold text-slate-900">
                            My Courses
                        </h2>

                        <p className="text-red-500 mt-3">
                            {error}
                        </p>
                    </div>
                </main>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 shadow-xl">

                <div className="mb-10">
                    <h1 className="text-2xl font-bold tracking-tight">
                        EduCore
                    </h1>

                    <p className="text-xs text-slate-400 mt-1">
                        University Management System
                    </p>
                </div>

                <nav className="space-y-1">

                    <Link
                        to="/teacher"
                        className="flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                        <span className="mr-3 text-sm">⌂</span>
                        Dashboard
                    </Link>

                    <div className="pt-5 pb-2">
                        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Teaching
                        </p>
                    </div>

                    <Link
                        to="/teacher/courses"
                        className="flex items-center px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-sm"
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

            {/* Main */}
            <main className="flex-1 min-w-0">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 px-8 py-5">

                    <div className="flex justify-between items-center">

                        <div>
                            <p className="text-sm font-medium text-indigo-600 mb-1">
                                Teacher Portal
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                My Courses
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Courses assigned to you
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <div className="hidden sm:block bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg">
                                <p className="text-xs text-slate-400">
                                    Total Courses
                                </p>

                                <p className="text-sm font-semibold text-slate-700">
                                    {assignments.length}
                                </p>
                            </div>

                            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                                T
                            </div>

                        </div>

                    </div>

                </header>

                {/* Content */}
                <div className="p-8">

                    {/* Overview */}
                    <div className="mb-6">

                        <h3 className="text-lg font-semibold text-slate-900">
                            Assigned Courses
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                            View the courses, semesters and sections assigned to you.
                        </p>

                    </div>

                    {assignments.length === 0 ? (

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

                            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-xl">
                                ▤
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800 mt-4">
                                No Courses Assigned
                            </h3>

                            <p className="text-sm text-slate-500 mt-2">
                                You currently have no courses assigned to you.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {assignments.map((assignment) => (

                                <div
                                    key={assignment.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition overflow-hidden"
                                >

                                    {/* Card Header */}
                                    <div className="p-6 border-b border-slate-100">

                                        <div className="flex justify-between items-start">

                                            <div>
                                                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                                    Course
                                                </p>

                                                <h3 className="text-xl font-bold text-slate-900 mt-2">
                                                    {assignment.courseOffering?.course?.code}
                                                </h3>
                                            </div>

                                            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                                ▤
                                            </div>

                                        </div>

                                        <p className="text-sm font-medium text-slate-700 mt-3">
                                            {assignment.courseOffering?.course?.name}
                                        </p>

                                    </div>

                                    {/* Card Details */}
                                    <div className="p-6 space-y-4">

                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">
                                                Semester
                                            </p>

                                            <p className="text-sm font-medium text-slate-700 mt-1">
                                                {assignment.courseOffering
                                                    ?.academicSemester?.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-wide">
                                                Section
                                            </p>

                                            <p className="text-sm font-medium text-slate-700 mt-1">
                                                {assignment.section?.name ||
                                                    "All Sections"}
                                            </p>
                                        </div>

                                        <div className="pt-2">

                                            <Link
                                                to={`/teacher/assessments?courseOfferingId=${assignment.courseOfferingId}`}
                                                className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                            >
                                                Manage Course
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default TeacherCourses;