import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import TeacherSidebar from "../../components/TeacherSidebar";

import {
    getAllTeacherAssignments,
} from "../../services/teacherAssignmentApi";

import {
    getAllClassSessions,
} from "../../services/classSessionApi";

import {
    getAttendancesByClassSession,
    createAttendance,
    updateAttendance,
    getClassroomAttendance,
} from "../../services/attendanceApi";

import {
    getEnrollments,
} from "../../services/enrollmentApi";


// ======================================================
// MAIN COMPONENT
// ======================================================

const Attendance = () => {

    const [searchParams] = useSearchParams();


    // ==================================================
    // URL PARAMETERS
    // ==================================================

    const courseOfferingId =
        searchParams.get("courseOfferingId");

    const classSessionId =
        searchParams.get("classSessionId");

    const showClassroom =
        searchParams.get("view") === "classroom";


    // ==================================================
    // STATE
    // ==================================================

    const [courses, setCourses] = useState([]);

    const [sessions, setSessions] = useState([]);

    const [students, setStudents] = useState([]);

    const [attendance, setAttendance] = useState({});

    const [classroomAttendance, setClassroomAttendance] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loadingSessions, setLoadingSessions] =
        useState(false);

    const [loadingStudents, setLoadingStudents] =
        useState(false);

    const [loadingClassroom, setLoadingClassroom] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==================================================
    // LOAD TEACHER COURSES
    // ==================================================

    useEffect(() => {

        const loadCourses = async () => {

            try {

                setLoading(true);
                setError("");

                const user = JSON.parse(
                    localStorage.getItem("user")
                );

                const response =
                    await getAllTeacherAssignments();

                const data =
                    response?.data ||
                    response ||
                    [];

                const teacherCourses = Array.isArray(data)
                    ? data.filter(
                          (assignment) =>
                              Number(
                                  assignment.teacher?.userId
                              ) === Number(user?.id)
                      )
                    : [];

                setCourses(teacherCourses);

            } catch (error) {

                console.error(
                    "Failed to load teacher courses:",
                    error
                );

                setError(
                    "Failed to load teacher courses"
                );

            } finally {

                setLoading(false);

            }

        };

        loadCourses();

    }, []);


    // ==================================================
    // LOAD CLASS SESSIONS
    // ==================================================

    useEffect(() => {

        if (!courseOfferingId) {
            return;
        }

        const loadSessions = async () => {

            try {

                setLoadingSessions(true);
                setError("");

                const response =
                    await getAllClassSessions();

                /*
                 * Backend response:
                 *
                 * {
                 *     success: true,
                 *     data: [...]
                 * }
                 */

                const data =
                    response?.data ||
                    response ||
                    [];

                const allSessions =
                    Array.isArray(data)
                        ? data
                        : [];

                const filteredSessions =
                    allSessions.filter(
                        (session) =>
                            Number(
                                session.courseOfferingId
                            ) === Number(
                                courseOfferingId
                            )
                    );

                setSessions(
                    filteredSessions
                );

            } catch (error) {

                console.error(
                    "Failed to load class sessions:",
                    error
                );

                setError(
                    "Failed to load class sessions"
                );

            } finally {

                setLoadingSessions(false);

            }

        };

        loadSessions();

    }, [courseOfferingId]);


    // ==================================================
    // LOAD CLASSROOM ATTENDANCE
    // ==================================================

    useEffect(() => {

        if (
            !courseOfferingId ||
            !showClassroom
        ) {
            return;
        }

        const loadClassroomAttendance =
            async () => {

                try {

                    setLoadingClassroom(true);
                    setError("");

                    const response =
                        await getClassroomAttendance(
                            courseOfferingId
                        );

                    const data =
                        response?.data ||
                        response ||
                        null;

                    setClassroomAttendance(
                        data
                    );

                } catch (error) {

                    console.error(
                        "Failed to load classroom attendance:",
                        error
                    );

                    setError(
                        "Failed to load classroom attendance"
                    );

                } finally {

                    setLoadingClassroom(false);

                }

            };

        loadClassroomAttendance();

    }, [
        courseOfferingId,
        showClassroom
    ]);


    // ==================================================
    // LOAD STUDENTS FOR SELECTED SESSION
    // ==================================================

    useEffect(() => {

        if (
            !courseOfferingId ||
            !classSessionId
        ) {
            return;
        }

        const loadStudents = async () => {

            try {

                setLoadingStudents(true);
                setError("");
                setSuccess("");

                // --------------------------------------
                // GET ALL ENROLLMENTS
                // --------------------------------------

                const enrollmentResponse =
                    await getEnrollments();

                const enrollmentData =
                    enrollmentResponse?.data ||
                    enrollmentResponse ||
                    [];

                const enrollments =
                    Array.isArray(enrollmentData)
                        ? enrollmentData
                        : [];


                // --------------------------------------
                // FILTER COURSE ENROLLMENTS
                // --------------------------------------

                const courseEnrollments =
                    enrollments.filter(
                        (enrollment) =>
                            Number(
                                enrollment.courseOfferingId
                            ) === Number(
                                courseOfferingId
                            )
                    );


                // --------------------------------------
                // GET EXISTING ATTENDANCE
                // --------------------------------------

                const attendanceResponse =
                    await getAttendancesByClassSession(
                        classSessionId
                    );

                const attendanceData =
                    attendanceResponse?.data ||
                    attendanceResponse ||
                    [];

                const existingAttendance =
                    Array.isArray(attendanceData)
                        ? attendanceData
                        : [];


                // --------------------------------------
                // MAP STUDENTS
                // --------------------------------------

                const mappedStudents =
                    courseEnrollments
                        .filter(
                            (enrollment) =>
                                enrollment.student
                        )
                        .map(
                            (enrollment) => {

                                const student =
                                    enrollment.student;

                                const existing =
                                    existingAttendance.find(
                                        (record) =>
                                            Number(
                                                record.studentId
                                            ) === Number(
                                                student.id
                                            )
                                    );

                                return {

                                    ...student,

                                    enrollmentId:
                                        enrollment.id,

                                    attendanceId:
                                        existing?.id ||
                                        null,

                                    status:
                                        existing?.status ||
                                        "PRESENT"

                                };

                            }
                        );


                setStudents(
                    mappedStudents
                );


                // --------------------------------------
                // INITIAL ATTENDANCE STATE
                // --------------------------------------

                const initialAttendance = {};

                mappedStudents.forEach(
                    (student) => {

                        if (student.id) {

                            initialAttendance[
                                student.id
                            ] =
                                student.status;

                        }

                    }
                );


                setAttendance(
                    initialAttendance
                );

            } catch (error) {

                console.error(
                    "Failed to load students:",
                    error
                );

                setError(
                    "Failed to load students"
                );

            } finally {

                setLoadingStudents(false);

            }

        };

        loadStudents();

    }, [
        courseOfferingId,
        classSessionId
    ]);


    // ==================================================
    // HANDLE STATUS CHANGE
    // ==================================================

    const handleStatusChange = (
        studentId,
        status
    ) => {

        setAttendance(
            (previous) => ({
                ...previous,
                [studentId]: status
            })
        );

    };


    // ==================================================
    // SAVE ATTENDANCE
    // ==================================================

    const handleSaveAttendance =
        async () => {

            if (!classSessionId) {
                return;
            }

            try {

                setSaving(true);
                setError("");
                setSuccess("");


                // --------------------------------------
                // CREATE / UPDATE ATTENDANCE
                // --------------------------------------

                for (
                    const student of students
                ) {

                    const status =
                        attendance[
                            student.id
                        ] ||
                        "PRESENT";


                    // Existing attendance
                    if (
                        student.attendanceId
                    ) {

                        await updateAttendance(
                            student.attendanceId,
                            status
                        );

                    }

                    // New attendance
                    else {

                        await createAttendance(
                            classSessionId,
                            student.id,
                            status
                        );

                    }

                }


                // --------------------------------------
                // RELOAD ATTENDANCE
                // --------------------------------------

                const response =
                    await getAttendancesByClassSession(
                        classSessionId
                    );

                const data =
                    response?.data ||
                    response ||
                    [];

                const updatedAttendance =
                    Array.isArray(data)
                        ? data
                        : [];


                // --------------------------------------
                // UPDATE STUDENTS
                // --------------------------------------

                const updatedStudents =
                    students.map(
                        (student) => {

                            const record =
                                updatedAttendance.find(
                                    (item) =>
                                        Number(
                                            item.studentId
                                        ) === Number(
                                            student.id
                                        )
                                );

                            return {

                                ...student,

                                attendanceId:
                                    record?.id ||
                                    student.attendanceId,

                                status:
                                    record?.status ||
                                    attendance[
                                        student.id
                                    ] ||
                                    "PRESENT"

                            };

                        }
                    );


                setStudents(
                    updatedStudents
                );


                setSuccess(
                    "Attendance saved successfully."
                );

            } catch (error) {

                console.error(
                    "Failed to save attendance:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Failed to save attendance"
                );

            } finally {

                setSaving(false);

            }

        };


    // ==================================================
    // INITIAL LOADING
    // ==================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-100">

                <TeacherSidebar />

                <main className="ml-64 p-8">

                    <p className="text-slate-600">
                        Loading attendance...
                    </p>

                </main>

            </div>
        );

    }


    // ==================================================
    // FULL CLASSROOM ATTENDANCE
    // ==================================================

    if (
        courseOfferingId &&
        showClassroom
    ) {

        const classroomSessions =
            classroomAttendance?.classSessions ||
            [];

        const classroomStudents =
            classroomAttendance?.students ||
            [];


        return (
            <div className="min-h-screen bg-slate-100">

                <TeacherSidebar />

                <main className="ml-64 p-8">

                    <div className="mb-6">

                        <Link
                            to={`/teacher/attendance?courseOfferingId=${courseOfferingId}`}
                            className="text-indigo-600 hover:underline"
                        >
                            ← Back to Class Sessions
                        </Link>


                        <h1 className="text-3xl font-bold text-slate-900 mt-4">
                            Full Classroom Attendance
                        </h1>


                        <p className="text-slate-500 mt-1">
                            Complete attendance record for all students
                        </p>

                    </div>


                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}


                    {loadingClassroom ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            <p className="text-slate-500">
                                Loading classroom attendance...
                            </p>

                        </div>

                    ) : classroomStudents.length === 0 ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            <p className="text-slate-500">
                                No students found.
                            </p>

                        </div>

                    ) : (

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                            <div className="overflow-x-auto">

                                <table className="w-full text-sm">

                                    <thead className="bg-slate-900 text-white">

                                        <tr>

                                            <th className="px-5 py-4 text-left whitespace-nowrap">
                                                Student
                                            </th>

                                            <th className="px-5 py-4 text-left whitespace-nowrap">
                                                Student ID
                                            </th>


                                            {classroomSessions.map(
                                                (session) => (

                                                    <th
                                                        key={session.id}
                                                        className="px-5 py-4 text-center whitespace-nowrap"
                                                    >
                                                        {new Date(
                                                            session.date
                                                        ).toLocaleDateString(
                                                            "en-GB",
                                                            {
                                                                day: "2-digit",
                                                                month: "short"
                                                            }
                                                        )}
                                                    </th>

                                                )
                                            )}


                                            <th className="px-5 py-4 text-center whitespace-nowrap">
                                                Attended
                                            </th>


                                            <th className="px-5 py-4 text-center whitespace-nowrap">
                                                Total
                                            </th>


                                            <th className="px-5 py-4 text-center whitespace-nowrap">
                                                Percentage
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-200">

                                        {classroomStudents.map(
                                            (student) => (

                                                <tr
                                                    key={student.studentId}
                                                    className="hover:bg-slate-50"
                                                >

                                                    <td className="px-5 py-4 font-medium text-slate-900 whitespace-nowrap">
                                                        {student.studentName}
                                                    </td>


                                                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                                                        {student.studentCode}
                                                    </td>


                                                    {classroomSessions.map(
                                                        (session) => {

                                                            const record =
                                                                student.attendance?.find(
                                                                    (item) =>
                                                                        Number(
                                                                            item.classSessionId
                                                                        ) ===
                                                                        Number(
                                                                            session.id
                                                                        )
                                                                );


                                                            const status =
                                                                record?.status ||
                                                                "-";


                                                            return (
                                                                <td
                                                                    key={session.id}
                                                                    className="px-5 py-4 text-center"
                                                                >

                                                                    {status === "PRESENT" && (
                                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                                                            P
                                                                        </span>
                                                                    )}


                                                                    {status === "ABSENT" && (
                                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                                                            A
                                                                        </span>
                                                                    )}


                                                                    {status === "LATE" && (
                                                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                                                                            L
                                                                        </span>
                                                                    )}


                                                                    {status === "-" && (
                                                                        <span className="text-slate-400">
                                                                            —
                                                                        </span>
                                                                    )}

                                                                </td>
                                                            );

                                                        }
                                                    )}


                                                    <td className="px-5 py-4 text-center font-medium text-slate-700">
                                                        {student.attendedClasses}
                                                    </td>


                                                    <td className="px-5 py-4 text-center text-slate-700">
                                                        {student.totalClasses}
                                                    </td>


                                                    <td className="px-5 py-4 text-center">

                                                        <span
                                                            className={`font-bold ${
                                                                Number(
                                                                    student.attendancePercentage
                                                                ) >= 80
                                                                    ? "text-green-600"
                                                                    : Number(
                                                                        student.attendancePercentage
                                                                    ) >= 60
                                                                    ? "text-yellow-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {student.attendancePercentage}%
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">

                                <div className="flex flex-wrap gap-5 text-sm text-slate-600">

                                    <span>
                                        <strong className="text-green-600">
                                            P
                                        </strong>{" "}
                                        Present
                                    </span>


                                    <span>
                                        <strong className="text-red-600">
                                            A
                                        </strong>{" "}
                                        Absent
                                    </span>


                                    <span>
                                        <strong className="text-yellow-600">
                                            L
                                        </strong>{" "}
                                        Late
                                    </span>

                                </div>

                            </div>

                        </div>

                    )}

                </main>

            </div>
        );

    }


    // ==================================================
    // TAKE ATTENDANCE
    // ==================================================

    if (
        courseOfferingId &&
        classSessionId
    ) {

        const selectedSession =
            sessions.find(
                (session) =>
                    Number(session.id) ===
                    Number(classSessionId)
            );


        // ----------------------------------------------
        // ATTENDANCE LOCK
        // ----------------------------------------------

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const classDate =
            selectedSession
                ? new Date(
                    selectedSession.date
                )
                : null;


        if (classDate) {

            classDate.setHours(
                0,
                0,
                0,
                0
            );

        }


        /*
         * Attendance is locked after
         * the class date.
         *
         * Example:
         *
         * Class date = Sep 5
         * Today      = Sep 5
         * => Editable
         *
         * Class date = Sep 5
         * Today      = Sep 6
         * => Locked
         */

        const isAttendanceLocked =
            classDate &&
            today > classDate;


        return (
            <div className="min-h-screen bg-slate-100">

                <TeacherSidebar />


                <main className="ml-64 p-8">

                    <Link
                        to={`/teacher/attendance?courseOfferingId=${courseOfferingId}`}
                        className="text-indigo-600 hover:underline"
                    >
                        ← Back to Class Sessions
                    </Link>


                    <div className="mt-4 mb-6">

                        <h1 className="text-3xl font-bold text-slate-900">
                            Take Attendance
                        </h1>


                        {selectedSession && (
                            <>
                                <p className="text-slate-500 mt-1">

                                    {new Date(
                                        selectedSession.date
                                    ).toLocaleDateString()}

                                    {" • "}

                                    {selectedSession.room ||
                                        "No room"}

                                </p>


                                {isAttendanceLocked && (
                                    <div className="mt-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">

                                        🔒 Attendance is locked for this class.
                                        Attendance can only be edited on the class date.

                                    </div>
                                )}

                            </>
                        )}

                    </div>


                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}


                    {success && (
                        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {success}
                        </div>
                    )}


                    {loadingStudents ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            Loading students...

                        </div>

                    ) : students.length === 0 ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            No students enrolled in this course.

                        </div>

                    ) : (

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-slate-900 text-white">

                                        <tr>

                                            <th className="px-6 py-4 text-left">
                                                Student
                                            </th>


                                            <th className="px-6 py-4 text-left">
                                                Student ID
                                            </th>


                                            <th className="px-6 py-4 text-center">
                                                Attendance
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-slate-200">

                                        {students.map(
                                            (student) => {

                                                const status =
                                                    attendance[
                                                        student.id
                                                    ] ||
                                                    "PRESENT";


                                                return (
                                                    <tr
                                                        key={student.id}
                                                        className="hover:bg-slate-50"
                                                    >

                                                        <td className="px-6 py-5 font-medium">

                                                            {student.name}

                                                        </td>


                                                        <td className="px-6 py-5 text-slate-600">

                                                            {student.studentId}

                                                        </td>


                                                        <td className="px-6 py-5">

                                                            <div className="flex justify-center gap-2">


                                                                {/* PRESENT */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isAttendanceLocked
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            student.id,
                                                                            "PRESENT"
                                                                        )
                                                                    }
                                                                    className={`px-4 py-2 rounded-lg font-medium ${
                                                                        status === "PRESENT"
                                                                            ? "bg-green-600 text-white"
                                                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                                                    } ${
                                                                        isAttendanceLocked
                                                                            ? "opacity-50 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    Present
                                                                </button>


                                                                {/* ABSENT */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isAttendanceLocked
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            student.id,
                                                                            "ABSENT"
                                                                        )
                                                                    }
                                                                    className={`px-4 py-2 rounded-lg font-medium ${
                                                                        status === "ABSENT"
                                                                            ? "bg-red-600 text-white"
                                                                            : "bg-red-50 text-red-700 hover:bg-red-100"
                                                                    } ${
                                                                        isAttendanceLocked
                                                                            ? "opacity-50 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    Absent
                                                                </button>


                                                                {/* LATE */}

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isAttendanceLocked
                                                                    }
                                                                    onClick={() =>
                                                                        handleStatusChange(
                                                                            student.id,
                                                                            "LATE"
                                                                        )
                                                                    }
                                                                    className={`px-4 py-2 rounded-lg font-medium ${
                                                                        status === "LATE"
                                                                            ? "bg-yellow-500 text-white"
                                                                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                                                    } ${
                                                                        isAttendanceLocked
                                                                            ? "opacity-50 cursor-not-allowed"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    Late
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>


                            {/* SAVE */}

                            <div className="p-6 border-t border-slate-200">

                                <button
                                    type="button"
                                    onClick={handleSaveAttendance}
                                    disabled={
                                        saving ||
                                        isAttendanceLocked
                                    }
                                    className={`px-6 py-3 rounded-lg font-semibold text-white ${
                                        isAttendanceLocked
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700"
                                    } ${
                                        saving
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >

                                    {isAttendanceLocked
                                        ? "Attendance Locked"
                                        : saving
                                        ? "Saving..."
                                        : "Save Attendance"}

                                </button>

                            </div>

                        </div>

                    )}

                </main>

            </div>
        );

    }


    // ==================================================
    // CLASS SESSIONS
    // ==================================================

    if (courseOfferingId) {

        const selectedCourse =
            courses.find(
                (assignment) =>
                    Number(
                        assignment.courseOfferingId
                    ) === Number(
                        courseOfferingId
                    )
            );


        return (
            <div className="min-h-screen bg-slate-100">

                <TeacherSidebar />


                <main className="ml-64 p-8">

                    <Link
                        to="/teacher/attendance"
                        className="text-indigo-600 hover:underline"
                    >
                        ← Back to My Courses
                    </Link>


                    <div className="flex items-center justify-between mt-4 mb-6">

                        <div>

                            <h1 className="text-3xl font-bold text-slate-900">
                                Class Sessions
                            </h1>


                            {selectedCourse && (
                                <p className="text-slate-500 mt-1">

                                    {
                                        selectedCourse
                                            .courseOffering
                                            ?.course
                                            ?.code
                                    }

                                    {" - "}

                                    {
                                        selectedCourse
                                            .courseOffering
                                            ?.course
                                            ?.name
                                    }

                                </p>
                            )}

                        </div>


                        <Link
                            to={`/teacher/attendance?courseOfferingId=${courseOfferingId}&view=classroom`}
                            className="px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                        >
                            View Full Attendance
                        </Link>

                    </div>


                    {error && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}


                    {loadingSessions ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            Loading class sessions...

                        </div>

                    ) : sessions.length === 0 ? (

                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                            No class sessions found.

                        </div>

                    ) : (

                        <div className="grid gap-5">

                            {sessions.map(
                                (session) => {

                                    const date =
                                        new Date(
                                            session.date
                                        ).toLocaleDateString();


                                    const status =
                                        session.status;


                                    return (
                                        <div
                                            key={session.id}
                                            className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between"
                                        >

                                            <div>

                                                <h2 className="text-lg font-semibold text-slate-900">

                                                    {date}

                                                </h2>


                                                <p className="text-sm text-slate-500 mt-1">

                                                    {session.room ||
                                                        "No room"}

                                                </p>


                                                <span
                                                    className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                                                        status === "FINISHED"
                                                            ? "bg-green-100 text-green-700"
                                                            : status === "CANCELLED"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >

                                                    {status}

                                                </span>

                                            </div>


                                            <div className="flex gap-3">

                                                {status !== "CANCELLED" && (

                                                    <Link
                                                        to={`/teacher/attendance?courseOfferingId=${courseOfferingId}&classSessionId=${session.id}`}
                                                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                                                    >
                                                        Take Attendance
                                                    </Link>

                                                )}

                                            </div>

                                        </div>
                                    );

                                }
                            )}

                        </div>

                    )}

                </main>

            </div>
        );

    }


    // ==================================================
    // COURSES
    // ==================================================

    return (
        <div className="min-h-screen bg-slate-100">

            <TeacherSidebar />


            <main className="ml-64 p-8">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-900">
                        Attendance
                    </h1>


                    <p className="text-slate-500 mt-1">
                        Select a course to manage attendance
                    </p>

                </div>


                {error && (
                    <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}


                {courses.length === 0 ? (

                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">

                        <p className="text-slate-500">
                            No courses assigned.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {courses.map(
                            (assignment) => {

                                const courseOffering =
                                    assignment.courseOffering;

                                const course =
                                    courseOffering?.course;

                                const section =
                                    assignment.section;


                                return (
                                    <div
                                        key={assignment.id}
                                        className="bg-white rounded-xl shadow-sm p-6"
                                    >

                                        <h2 className="text-xl font-bold text-slate-900">

                                            {course?.code}

                                        </h2>


                                        <p className="text-slate-600 mt-1">

                                            {course?.name}

                                        </p>


                                        <div className="mt-4 space-y-1 text-sm text-slate-500">

                                            <p>

                                                Section:{" "}

                                                <span className="font-medium text-slate-700">

                                                    {
                                                        section?.name ||
                                                        section?.sectionName ||
                                                        "N/A"
                                                    }

                                                </span>

                                            </p>


                                            <p>

                                                Semester:{" "}

                                                <span className="font-medium text-slate-700">

                                                    {
                                                        courseOffering
                                                            ?.academicSemester
                                                            ?.name
                                                    }

                                                </span>

                                            </p>

                                        </div>


                                        <Link
                                            to={`/teacher/attendance?courseOfferingId=${assignment.courseOfferingId}`}
                                            className="inline-block mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                                        >
                                            View Attendance
                                        </Link>

                                    </div>
                                );

                            }
                        )}

                    </div>

                )}

            </main>

        </div>
    );
};


export default Attendance;