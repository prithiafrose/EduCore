import { useEffect, useState } from "react";
import {
    getTimetablesByStudentId
} from "../../services/timetableApi";
import {
    getStudentByUserId
} from "../../services/studentApi";

const ClassRoutine = () => {
    const [student, setStudent] = useState(null);
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const days = [
        { id: 0, name: "Sunday" },
        { id: 1, name: "Monday" },
        { id: 2, name: "Tuesday" },
        { id: 3, name: "Wednesday" },
        { id: 4, name: "Thursday" },
        { id: 5, name: "Friday" },
        { id: 6, name: "Saturday" }
    ];

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                setLoading(true);
                setError("");

                const storedUser =
                    JSON.parse(localStorage.getItem("user"));

                if (!storedUser || !storedUser.id) {
                    setError("User information not found.");
                    return;
                }

                // Get logged-in student
                const currentStudent = await getStudentByUserId(
                    storedUser.id
                );

                if (!currentStudent) {
                    setError("Student profile not found.");
                    return;
                }

                setStudent(currentStudent);

                // Get student's timetable
                const routine =
                    await getTimetablesByStudentId(
                        currentStudent.id
                    );

                setTimetables(routine);

            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load class routine."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, []);

    const formatTime = (dateString) => {
        if (!dateString) return "";

        return new Date(dateString).toLocaleTimeString(
            "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        );
    };

    const getSessionStatusLabel = (classSessions) => {
        if (
            !Array.isArray(classSessions) ||
            classSessions.length === 0
        ) {
            return null;
        }

        const session = classSessions[0];

        const status = session.status;

        if (status === "FINISHED") {
            return {
                text: "Completed",
                className: "text-emerald-400"
            };
        }

        if (status === "CANCELLED") {
            return {
                text: "Cancelled",
                className: "text-red-400"
            };
        }

        if (status === "SCHEDULED") {
            const sessionDate = new Date(session.date);
            const today = new Date();

            if (
                sessionDate.toDateString() ===
                today.toDateString()
            ) {
                const time = session.startTime
                    ? new Date(session.startTime)
                        .toTimeString()
                        .slice(0, 5)
                    : "";

                return {
                    text: `Today ${time}`.trim(),
                    className: "text-blue-400"
                };
            }

            const startOfToday = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );

            const formattedDate =
                sessionDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

            if (sessionDate < startOfToday) {
                return {
                    text: `Last ${formattedDate}`,
                    className: "text-slate-500"
                };
            }

            return {
                text: `Upcoming ${formattedDate}`,
                className: "text-emerald-400"
            };
        }

        return null;
    };

    const getClassesForDay = (dayId) => {
        return timetables
            .filter(
                (item) => Number(item.dayOfWeek) === dayId
            )
            .sort(
                (a, b) =>
                    new Date(a.startTime) -
                    new Date(b.startTime)
            );
    };

    return (
        <>
        {/* TOP BAR */}
        <header className="h-16 bg-white/[0.03] border-b border-white/10 flex items-center justify-between px-8">

                    <div>
                        <h2 className="text-lg font-semibold text-slate-100">
                            Class Routine
                        </h2>
                    </div>

                    {student && (
                        <div className="text-right">
                            <p className="font-medium text-slate-100">
                                {student.name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {student.studentId}
                            </p>
                        </div>
                    )}

                </header>


                {/* PAGE CONTENT */}
                <div className="p-8">

                    {/* PAGE TITLE */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-100">
                            Weekly Class Routine
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Your scheduled classes for the week
                        </p>
                    </div>


                    {/* LOADING */}
                    {loading && (
                        <div className="bg-white/[0.03] rounded-xl shadow-sm p-10 text-center">
                            <p className="text-slate-500">
                                Loading class routine...
                            </p>
                        </div>
                    )}


                    {/* ERROR */}
                    {!loading && error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-5">
                            {error}
                        </div>
                    )}


                    {/* NO ROUTINE */}
                    {!loading &&
                        !error &&
                        timetables.length === 0 && (
                            <div className="bg-white/[0.03] rounded-xl shadow-sm p-10 text-center">
                                <h3 className="text-lg font-semibold text-slate-200">
                                    No Classes Scheduled
                                </h3>

                                <p className="text-slate-500 mt-2">
                                    You currently have no scheduled
                                    classes.
                                </p>
                            </div>
                        )}


                    {/* WEEKLY ROUTINE */}
                    {!loading &&
                        !error &&
                        timetables.length > 0 && (
                            <div className="space-y-6">

                                {days.map((day) => {

                                    const classes =
                                        getClassesForDay(day.id);

                                    return (
                                        <div
                                            key={day.id}
                                            className="bg-white/[0.03] rounded-xl shadow-sm overflow-hidden"
                                        >

                                            {/* DAY HEADER */}
                                            <div className="px-6 py-4 bg-white/10 text-white">
                                                <h2 className="text-lg font-semibold">
                                                    {day.name}
                                                </h2>
                                            </div>


                                            {/* NO CLASS */}
                                            {classes.length === 0 && (
                                                <div className="px-6 py-5 text-slate-500">
                                                    No classes
                                                </div>
                                            )}


                                            {/* CLASSES */}
                                            {classes.length > 0 && (
                                                <div className="divide-y divide-white/5">

                                                    {classes.map(
                                                        (item) => {
                                                            const sessionLabel =
                                                                getSessionStatusLabel(
                                                                    item.classSessions
                                                                );

                                                            return (
                                                            <div
                                                                key={
                                                                    item.id
                                                                }
                                                                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                                            >

                                                                {/* COURSE */}
                                                                <div>
                                                                    <p className="text-sm font-semibold text-blue-400">
                                                                        {
                                                                            item
                                                                                .courseOffering
                                                                                ?.course
                                                                                ?.code
                                                                        }
                                                                    </p>

                                                                    <h3 className="text-lg font-semibold text-slate-100 mt-1">
                                                                        {
                                                                            item
                                                                                .courseOffering
                                                                                ?.course
                                                                                ?.name
                                                                        }
                                                                    </h3>

                                                                    <p className="text-sm text-slate-500 mt-1">
                                                                        {
                                                                            item
                                                                                .section
                                                                                ?.name
                                                                        }
                                                                    </p>
                                                                </div>


                                                                {/* TIME */}
                                                                <div className="text-sm text-slate-300">
                                                                    <p className="font-medium text-slate-100">
                                                                        {formatTime(
                                                                            item.startTime
                                                                        )}{" "}
                                                                        -
                                                                        {" "}
                                                                        {formatTime(
                                                                            item.endTime
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1">
                                                                        Room:{" "}
                                                                        {item.room ||
                                                                            "Not assigned"}
                                                                    </p>
                                                                </div>


                                                                {/* TEACHER */}
                                                                <div className="text-sm">
                                                                    <p className="text-slate-500">
                                                                        Teacher
                                                                    </p>

                                                                    <p className="font-medium text-slate-200">
                                                                        {
                                                                            item
                                                                                .teacherAssignment
                                                                                ?.teacher
                                                                                ?.name ||
                                                                            "Not assigned"
                                                                        }
                                                                    </p>
                                                                </div>


                                                                {/* SESSION STATUS */}
                                                                {sessionLabel && (
                                                                    <div className="text-sm font-medium">
                                                                        <span className={sessionLabel.className}>
                                                                            {sessionLabel.text}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                            </div>
                                                        );
                                                    })}

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                </div>

        </>
    );
};

export default ClassRoutine;