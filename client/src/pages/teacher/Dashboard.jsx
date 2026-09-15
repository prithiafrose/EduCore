import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import StatCard from "../../components/ui/StatCard";
import AnimatedCard from "../../components/ui/AnimatedCard";
import SpotlightCard from "../../components/reactbits/SpotlightCard";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";
import { getEnrollments } from "../../services/enrollmentApi";
import { getAllClassSessions } from "../../services/classSessionApi";
import { getAllAssignments } from "../../services/assignmentApi";

function Dashboard() {
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

    const quickAccess = [
        { to: "/teacher/assessments", icon: "✓", title: "Assessments", subtitle: "Enter and manage student assessment marks.", accent: "bg-indigo-50 text-indigo-600" },
        { to: "/teacher/exams", icon: "▣", title: "Exams", subtitle: "Manage examination marks and results.", accent: "bg-amber-50 text-amber-600" },
        { to: "/teacher/assignments", icon: "✎", title: "Assignments", subtitle: loading ? "Loading..." : `${assignmentCount} active assignment${assignmentCount === 1 ? "" : "s"} in your courses.`, accent: "bg-emerald-50 text-emerald-600" },
    ];

    return (
        <div className="p-8">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Teaching Overview
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Manage your courses, classes, attendance and academic activities.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            <SpotlightCard className="rounded-2xl">
                                <Link to="/teacher/courses">
                                    <StatCard
                                        icon="▤"
                                        label="My Courses"
                                        value={courses.length}
                                        hint="Courses assigned to you"
                                        accent="indigo"
                                        loading={loading}
                                    />
                                </Link>
                            </SpotlightCard>

                            <SpotlightCard className="rounded-2xl">
                                <Link to="/teacher/routine">
                                    <StatCard
                                        icon="◷"
                                        label="Class Routine"
                                        value={sessionCount}
                                        hint="Scheduled classes"
                                        accent="emerald"
                                        loading={loading}
                                    />
                                </Link>
                            </SpotlightCard>

                            <SpotlightCard className="rounded-2xl">
                                <Link to="/teacher/attendance">
                                    <StatCard
                                        icon="✓"
                                        label="Attendance"
                                        value={todaySessions.length}
                                        hint="Classes today"
                                        accent="amber"
                                        loading={loading}
                                    />
                                </Link>
                            </SpotlightCard>

                            <SpotlightCard className="rounded-2xl">
                                <Link to="/teacher/students">
                                    <StatCard
                                        icon="♙"
                                        label="Students"
                                        value={studentCount}
                                        hint="Students in your courses"
                                        accent="purple"
                                        loading={loading}
                                    />
                                </Link>
                            </SpotlightCard>
                        </div>

                        <AnimatedCard className="mt-8" hover={false}>
                            <div className="px-6 py-5 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    Academic Management
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Manage student assessment and examination activities.
                                </p>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                                {quickAccess.map((item, index) => (
                                    <motion.div
                                        key={item.to}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + index * 0.08 }}
                                        whileHover={{ y: -2 }}
                                    >
                                        <Link
                                            to={item.to}
                                            className="flex items-start gap-4 border border-slate-200 rounded-xl p-5 h-full hover:border-indigo-300 hover:shadow-sm transition"
                                        >
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${item.accent}`}>
                                                {item.icon}
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-slate-800">
                                                    {item.title}
                                                </h4>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {item.subtitle}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <AnimatedCard className="mt-8" hover={false}>
                            <div className="px-6 py-5 border-b border-slate-200">
                                <h3 className="text-xl font-semibold text-slate-900">
                                    Today's Classes
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    {loading
                                        ? "Loading your schedule..."
                                        : todaySessions.length === 0
                                        ? "You have no classes scheduled today."
                                        : `${todaySessions.length} class${todaySessions.length === 1 ? "" : "es"} scheduled today.`}
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
                                        {todaySessions.map((session, index) => (
                                            <motion.div
                                                key={session.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + index * 0.06 }}
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
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </AnimatedCard>
                    </div>
  );
}

export default Dashboard;