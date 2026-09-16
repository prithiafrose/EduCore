import { useEffect, useState } from "react";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";
import { getAllTimetables } from "../../services/timetableApi";
import {
    getAllClassSessions,
    cancelClassSession,
} from "../../services/classSessionApi";

function Routine() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [routineSlots, setRoutineSlots] = useState([]);
    const [classSessions, setClassSessions] = useState([]);

    // ==================================================
    // LOAD ROUTINE
    // ==================================================

    useEffect(() => {
        const loadRoutine = async () => {
            try {
                setLoading(true);
                setError("");

                // Teacher assignments
                const assignmentResponse =
                    await getAllTeacherAssignments();

                const assignments = Array.isArray(
                    assignmentResponse
                )
                    ? assignmentResponse
                    : assignmentResponse?.data || [];

                const myAssignments = assignments.filter(
                    (assignment) =>
                        Number(
                            assignment.teacher?.userId
                        ) === Number(user?.id)
                );

                const assignmentIds = myAssignments.map(
                    (assignment) =>
                        Number(assignment.id)
                );

                // Timetable slots
                const timetableResponse =
                    await getAllTimetables();

                const timetables = Array.isArray(
                    timetableResponse
                )
                    ? timetableResponse
                    : timetableResponse?.data || [];

                const teacherSlots = timetables.filter(
                    (slot) =>
                        assignmentIds.includes(
                            Number(
                                slot.teacherAssignmentId
                            )
                        )
                );

                setRoutineSlots(teacherSlots);

                // Class sessions
                const sessionResponse =
                    await getAllClassSessions();

                const sessions = Array.isArray(
                    sessionResponse
                )
                    ? sessionResponse
                    : sessionResponse?.data || [];

                const offeringIds = myAssignments.map(
                    (assignment) =>
                        Number(
                            assignment.courseOfferingId
                        )
                );

                const teacherSessions = sessions
                    .filter((session) =>
                        offeringIds.includes(
                            Number(
                                session.courseOfferingId
                            )
                        )
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.date) -
                            new Date(a.date)
                    );

                setClassSessions(teacherSessions);
            } catch (err) {
                console.error(
                    "Failed to load routine:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load routine"
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoutine();
    }, []);

    // ==================================================
    // GROUP SLOTS BY DAY
    // ==================================================

    const groupByDay = () => {
        const groups = {};

        routineSlots.forEach((slot) => {
            const dayKey = slot.day ?? slot.dayOfWeek;

            if (!groups[dayKey]) {
                groups[dayKey] = [];
            }

            groups[dayKey].push(slot);
        });

        return groups;
    };

    const dayName = (value) => {
        const days = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];

        if (typeof value === "number") {
            return days[value] || "TBD";
        }

        if (typeof value === "string") {
            const name = value.toUpperCase();

            return days.includes(name) ? name : value;
        }

        return "TBD";
    };

    const formatTime = (value) => {
        if (!value) return "-";

        const safe = new Date(
            `1970-01-01T${value}`
        );

        if (isNaN(safe.getTime())) {
            return value;
        }

        return safe.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (value) => {
        if (!value) return "-";

        return new Date(value).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const handleCancelSession = async (id) => {
        try {
            await cancelClassSession(id);

            setClassSessions((previous) =>
                previous.filter(
                    (session) => session.id !== id
                )
            );
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                    "Failed to cancel session"
            );
        }
    };

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <>
                <header className="bg-white/[0.03] border-b border-white/10 px-8 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-400">
                            Teacher Portal
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight text-white">
                            Class Routine
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            View your weekly teaching schedule
                        </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                        T
                    </div>
                </header>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
                            {error}
                        </div>
                    )}

                    {/* -------- DAILY SLOTS -------- */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {loading ? (
                            <div className="col-span-full rounded-xl bg-white/[0.03] p-8 text-center text-slate-500">
                                Loading routine...
                            </div>
                        ) : routineSlots.length === 0 ? (
                            <div className="col-span-full rounded-xl bg-white/[0.03] p-8 text-center text-slate-500">
                                No classes assigned to you yet.
                            </div>
                        ) : (
                            Object.entries(groupByDay()).map(
                                ([dayKey, slots]) => (
                                    <div
                                        key={dayKey}
                                        className="rounded-xl bg-white/[0.03] shadow-sm overflow-hidden"
                                    >
                                        <div className="bg-slate-900 text-white px-5 py-3 font-semibold">
                                            {dayName(dayKey)}
                                        </div>

                                        <div className="divide-y divide-white/5">

                                            {slots
                                                .slice()
                                                .sort(
                                                    (a, b) =>
                                                        new Date(
                                                            `1970-01-01T${a.startTime}`
                                                        ) -
                                                        new Date(
                                                            `1970-01-01T${b.startTime}`
                                                        )
                                                )
                                                .map((slot) => (
                                                    <div
                                                        key={slot.id}
                                                        className="px-5 py-4"
                                                    >

                                                        <div className="text-sm text-slate-400">
                                                            {formatTime(
                                                                slot.startTime
                                                            )}{" "}
                                                            —{" "}
                                                            {formatTime(
                                                                slot.endTime
                                                            )}
                                                        </div>

                                                        <div className="font-medium text-slate-100 mt-1">
                                                            {slot.courseOffering
                                                                ?.course
                                                                ?.title ||
                                                                slot.courseOffering
                                                                    ?.course
                                                                    ?.name ||
                                                                "Course"}
                                                        </div>

                                                        <div className="text-xs text-slate-400 mt-1">
                                                            {slot.section
                                                                ?.name ||
                                                                "All Sections"}{" "}
                                                            •{" "}
                                                            {slot.room ||
                                                                "No room"}
                                                        </div>

                                                    </div>
                                                ))}

                                        </div>

                                    </div>
                                )
                            )
                        )}

                    </div>

                    {/* -------- CLASS SESSIONS -------- */}

                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-slate-100">
                            Class Sessions
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            Upcoming and past sessions for your
                            courses
                        </p>

                        {classSessions.length === 0 ? (
                            <div className="mt-4 rounded-xl bg-white/[0.03] p-8 text-center text-slate-500">
                                No class sessions found.
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl bg-white/[0.03] shadow-sm overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-white/5 text-left">
                                        <tr className="border-b">
                                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                                Course
                                            </th>
                                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                                Date
                                            </th>
                                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                                Time
                                            </th>
                                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                                Room
                                            </th>
                                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                                Status
                                            </th>
                                            <th className="px-5 py-3 text-center text-sm font-semibold text-slate-200">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5">

                                        {classSessions.map(
                                            (session) => (
                                                <tr
                                                    key={session.id}
                                                    className="hover:bg-white/5"
                                                >

                                                    <td className="px-5 py-4 font-medium text-slate-100">
                                                        {session.courseOffering
                                                            ?.course
                                                            ?.title ||
                                                            session.courseOffering
                                                                ?.course
                                                                ?.name ||
                                                            `Course ${session.courseOfferingId}`}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-300">
                                                        {formatDate(
                                                            session.date
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-300">
                                                        {formatTime(
                                                            session.startTime
                                                        )}{" "}
                                                        —{" "}
                                                        {formatTime(
                                                            session.endTime
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm text-slate-300">
                                                        {session.room ||
                                                            "-"}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                                session.status ===
                                                                "COMPLETED"
                                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                                    : session.status ===
                                                                      "CANCELLED"
                                                                    ? "bg-red-500/15 text-red-300"
                                                                    : "bg-blue-500/15 text-blue-300"
                                                            }`}
                                                        >
                                                            {session.status ||
                                                                "SCHEDULED"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-center gap-2">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCancelSession(
                                                                        session.id
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/15"
                                                            >
                                                                Cancel
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>
                </div>
    </>
    );
}

export default Routine;