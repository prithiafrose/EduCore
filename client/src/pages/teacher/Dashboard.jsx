import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  FileText,
  PenLine,
  Users,
} from "lucide-react";

import StatCard from "../../components/ui/StatCard";
import AnimatedCard from "../../components/ui/AnimatedCard";
import ParticleField from "../../components/reactbits/ParticleField";
import GradientText from "../../components/reactbits/GradientText";
import ScrollReveal from "../../components/reactbits/ScrollReveal";
import TiltCard from "../../components/reactbits/TiltCard";
import SpotlightCard from "../../components/reactbits/SpotlightCard";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";
import { getEnrollments } from "../../services/enrollmentApi";
import { getAllClassSessions } from "../../services/classSessionApi";
import { getAllAssignments } from "../../services/assignmentApi";

const ease = [0.22, 1, 0.36, 1];

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
        const storedUser = JSON.parse(localStorage.getItem("user"));

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
            Number(assignment.teacher?.userId) === Number(storedUser?.id)
        );

        setCourses(teacherCourses);

        const offeringIds = new Set(
          teacherCourses.map((c) => Number(c.courseOfferingId))
        );

        const allEnrollments = Array.isArray(enrollmentsResponse)
          ? enrollmentsResponse
          : enrollmentsResponse?.data || [];

        setStudentCount(
          new Set(
            allEnrollments
              .filter((e) => offeringIds.has(Number(e.courseOfferingId)))
              .map((e) => Number(e.studentId))
          ).size
        );

        const allSessions = Array.isArray(sessionsResponse)
          ? sessionsResponse
          : sessionsResponse?.data || [];

        const teacherSessions = allSessions.filter((s) =>
          offeringIds.has(Number(s.courseOfferingId))
        );

        setSessionCount(
          teacherSessions.filter((s) => s.status !== "CANCELLED").length
        );

        const now = new Date();
        const todayString = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        setTodaySessions(
          teacherSessions
            .filter(
              (s) =>
                s.status !== "CANCELLED" &&
                (s.date || "").slice(0, 10) === todayString
            )
            .sort(
              (a, b) => new Date(a.startTime) - new Date(b.startTime)
            )
        );

        const allAssignmentsList = Array.isArray(allAssignmentsResponse)
          ? allAssignmentsResponse
          : allAssignmentsResponse?.data || [];

        setAssignmentCount(
          allAssignmentsList.filter((a) =>
            offeringIds.has(Number(a.courseOfferingId))
          ).length
        );
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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

  const overviewStats = [
    {
      key: "courses",
      to: "/teacher/courses",
      icon: <BookOpen size={20} />,
      label: "My Courses",
      value: courses.length,
      hint: "Courses assigned to you",
      accent: "indigo",
    },
    {
      key: "routine",
      to: "/teacher/routine",
      icon: <CalendarDays size={20} />,
      label: "Class Routine",
      value: sessionCount,
      hint: "Scheduled classes",
      accent: "emerald",
    },
    {
      key: "attendance",
      to: "/teacher/attendance",
      icon: <ClipboardCheck size={20} />,
      label: "Attendance",
      value: todaySessions.length,
      hint: "Classes today",
      accent: "amber",
    },
    {
      key: "students",
      to: "/teacher/students",
      icon: <Users size={20} />,
      label: "Students",
      value: studentCount,
      hint: "Students in your courses",
      accent: "purple",
    },
  ];

  const quickAccess = [
    {
      key: "assessments",
      to: "/teacher/assessments",
      icon: <ClipboardList size={20} />,
      title: "Assessments",
      subtitle: "Enter and manage student assessment marks.",
      accent: "bg-indigo-500/10 text-indigo-400",
    },
    {
      key: "exams",
      to: "/teacher/exams",
      icon: <FileText size={20} />,
      title: "Exams",
      subtitle: "Manage examination marks and results.",
      accent: "bg-amber-500/10 text-amber-400",
    },
    {
      key: "assignments",
      to: "/teacher/assignments",
      icon: <PenLine size={20} />,
      title: "Assignments",
      subtitle: loading
        ? "Loading..."
        : `${assignmentCount} active assignment${
            assignmentCount === 1 ? "" : "s"
          } in your courses.`,
      accent: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
      >
        <ParticleField className="opacity-80" quantity={45} color="#818cf8" />

        <div className="relative z-10 px-6 py-7">
          <div>
            <GradientText>
              <h3 className="text-xl font-bold tracking-tight">
                Teaching Overview
              </h3>
            </GradientText>

            <p className="text-sm text-slate-400 mt-1">
              Manage your courses, classes, attendance and academic
              activities.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {overviewStats.map((card, index) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12 + index * 0.08,
                  duration: 0.55,
                  ease,
                }}
              >
                <TiltCard
                  className="h-full rounded-2xl"
                  maxTilt={6}
                  scale={1.015}
                  glare
                >
                  <SpotlightCard className="h-full rounded-2xl">
                    <Link to={card.to}>
                      <StatCard
                        icon={card.icon}
                        label={card.label}
                        value={card.value}
                        hint={card.hint}
                        accent={card.accent}
                        loading={loading}
                      />
                    </Link>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <ScrollReveal>
        <AnimatedCard hover={false}>
          <div className="px-6 py-5 border-b border-white/10">
            <GradientText>
              <h3 className="text-lg font-bold tracking-tight">
                Academic Management
              </h3>
            </GradientText>

            <p className="text-sm text-slate-400 mt-1">
              Manage student assessment and examination activities.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {quickAccess.map((item, index) => (
              <ScrollReveal key={item.key} delay={index * 0.08} y={16}>
                <Link
                  to={item.to}
                  className="flex items-start gap-4 border border-white/10 rounded-xl p-5 h-full hover:border-indigo-300 hover:shadow-lg hover:shadow-black/20 transition"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.accent}`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-100">
                      {item.title}
                    </h4>

                    <p className="text-sm text-slate-500 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </AnimatedCard>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <AnimatedCard hover={false}>
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">
              Today's Classes
            </h3>

            <p className="text-sm text-slate-400 mt-1">
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
              <p className="text-sm text-slate-400">
                Loading your schedule...
              </p>
            ) : todaySessions.length === 0 ? (
              <motion.div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"
                >
                  <CalendarDays size={18} />
                </motion.div>

                <div>
                  <p className="text-sm font-medium text-slate-200">
                    No classes today.
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Check your class routine for upcoming sessions.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="divide-y divide-white/5">
                {todaySessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 + index * 0.06,
                      duration: 0.4,
                      ease,
                    }}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <CalendarClock size={20} />
                      </div>

                      <div>
                        <p className="font-medium text-slate-100">
                          {session.courseOffering?.course?.code || "Course"}
                        </p>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {session.courseOffering?.course?.name || "N/A"}
                          {session.room ? ` · Room ${session.room}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-200">
                        {formatTime(session.startTime)}
                        {" - "}
                        {formatTime(session.endTime)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </AnimatedCard>
      </ScrollReveal>
    </div>
  );
}

export default Dashboard;