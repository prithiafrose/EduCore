import { useEffect, useState } from "react";
import StudentSidebar from "../../components/StudentSidebar";
import {
    getAttendancesByStudentId
} from "../../services/attendanceApi";

import {
    getStudentByUserId
} from "../../services/studentApi";

import {
    getEnrollmentsByStudentId
} from "../../services/enrollmentApi";


const Attendance = () => {

    const [student, setStudent] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchAttendance = async () => {

            try {

                setLoading(true);
                setError("");

                // Get logged-in user
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


                // Get student's enrollments
                const enrollments =
                    await getEnrollmentsByStudentId(
                        currentStudent.id
                    );


                // Get student's attendance records
                const attendanceResponse =
                    await getAttendancesByStudentId(
                        currentStudent.id
                    );


                const attendanceData =
                    attendanceResponse?.data || [];


                setAttendanceRecords(attendanceData);


                /*
                 * Create course-wise attendance information
                 */
                const courseMap = {};


                enrollments.forEach((enrollment) => {

                    const courseOffering =
                        enrollment.courseOffering;

                    const course =
                        courseOffering?.course;


                    if (!courseOffering || !course) {
                        return;
                    }


                    const courseOfferingId =
                        courseOffering.id;


                    courseMap[courseOfferingId] = {

                        courseOfferingId,

                        code: course.code,

                        name: course.name,

                        credit: course.credit,

                        semester:
                            courseOffering
                                ?.academicSemester
                                ?.name || "N/A",

                        totalClasses: 0,

                        attendedClasses: 0,

                        percentage: 0,

                        attendanceMarks: 0
                    };

                });


                /*
                 * Only FINISHED classes are counted,
                 * matching the existing backend attendance
                 * calculation.
                 */
                const finishedSessions = {};


                attendanceData.forEach((record) => {

                    const session =
                        record.classSession;


                    if (!session) {
                        return;
                    }


                    if (session.status !== "FINISHED") {
                        return;
                    }


                    const courseOfferingId =
                        session.courseOfferingId;


                    if (!finishedSessions[courseOfferingId]) {
                        finishedSessions[courseOfferingId] = {};
                    }


                    finishedSessions[
                        courseOfferingId
                    ][session.id] = true;

                });


                /*
                 * Count total finished classes
                 */
                Object.keys(courseMap).forEach(
                    (courseOfferingId) => {

                        const sessions =
                            finishedSessions[
                                courseOfferingId
                            ] || {};

                        courseMap[
                            courseOfferingId
                        ].totalClasses =
                            Object.keys(sessions).length;

                    }
                );


                /*
                 * Count attended classes
                 *
                 * PRESENT and LATE are considered attended.
                 */
                attendanceData.forEach((record) => {

                    const session =
                        record.classSession;


                    if (!session) {
                        return;
                    }


                    if (session.status !== "FINISHED") {
                        return;
                    }


                    const courseOfferingId =
                        session.courseOfferingId;


                    if (!courseMap[courseOfferingId]) {
                        return;
                    }


                    if (
                        record.status === "PRESENT" ||
                        record.status === "LATE"
                    ) {

                        courseMap[
                            courseOfferingId
                        ].attendedClasses++;

                    }

                });


                /*
                 * Calculate percentage and marks
                 */
                Object.values(courseMap).forEach(
                    (course) => {

                        if (course.totalClasses === 0) {

                            course.percentage = 0;

                        } else {

                            course.percentage =
                                (
                                    course.attendedClasses /
                                    course.totalClasses
                                ) * 100;

                        }


                        /*
                         * Same attendance mark rules
                         * used by the backend.
                         */
                        if (course.percentage >= 90) {
                            course.attendanceMarks = 10;

                        } else if (
                            course.percentage >= 80
                        ) {
                            course.attendanceMarks = 9;

                        } else if (
                            course.percentage >= 70
                        ) {
                            course.attendanceMarks = 8;

                        } else if (
                            course.percentage >= 60
                        ) {
                            course.attendanceMarks = 7;

                        } else if (
                            course.percentage >= 50
                        ) {
                            course.attendanceMarks = 6;

                        } else if (
                            course.percentage >= 40
                        ) {
                            course.attendanceMarks = 5;

                        } else {
                            course.attendanceMarks = 0;
                        }


                        course.percentage =
                            Number(
                                course.percentage.toFixed(2)
                            );

                    }
                );


                setCourses(
                    Object.values(courseMap)
                );


            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load attendance."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchAttendance();

    }, []);


    // Format date
    const formatDate = (dateString) => {

        if (!dateString) {
            return "N/A";
        }

        return new Date(
            dateString
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    };


    // Get status styling
    const getStatusStyle = (status) => {

        if (status === "PRESENT") {

            return "bg-green-100 text-green-700";

        }

        if (status === "LATE") {

            return "bg-yellow-100 text-yellow-700";

        }

        return "bg-red-100 text-red-700";

    };


    // Calculate overall attendance
    const totalClasses =
        courses.reduce(
            (sum, course) =>
                sum + course.totalClasses,
            0
        );


    const totalAttended =
        courses.reduce(
            (sum, course) =>
                sum + course.attendedClasses,
            0
        );


    const overallPercentage =
        totalClasses === 0
            ? 0
            : (
                totalAttended /
                totalClasses
            ) * 100;


    return (

        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}

            <StudentSidebar />


            {/* Main */}

            <main className="ml-64 flex-1">

                {/* Header */}

                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">

                    <div>

                        <h2 className="text-lg font-semibold text-slate-800">
                            Attendance
                        </h2>

                    </div>


                    {student && (

                        <div className="text-right">

                            <p className="font-medium text-slate-800">
                                {student.name}
                            </p>

                            <p className="text-sm text-slate-500">
                                {student.studentId}
                            </p>

                        </div>

                    )}

                </header>


                <div className="p-8">

                    {/* Page heading */}

                    <div className="mb-8">

                        <h1 className="text-2xl font-bold text-slate-800">
                            My Attendance
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Track your attendance for all enrolled courses
                        </p>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                            <p className="text-slate-500">
                                Loading attendance...
                            </p>

                        </div>

                    )}


                    {/* Error */}

                    {!loading && error && (

                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">

                            {error}

                        </div>

                    )}


                    {!loading && !error && (

                        <>

                            {/* Overall Attendance */}

                            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Overall Attendance
                                        </p>

                                        <p className="text-3xl font-bold text-slate-800 mt-1">
                                            {overallPercentage.toFixed(2)}%
                                        </p>

                                        <p className="text-sm text-slate-500 mt-2">
                                            {totalAttended} attended out of {totalClasses} finished classes
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-sm text-slate-500">
                                            Attendance Status
                                        </p>

                                        <p
                                            className={`text-lg font-semibold mt-1 ${
                                                overallPercentage >= 75
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {overallPercentage >= 75
                                                ? "Good"
                                                : "Low"}
                                        </p>

                                    </div>

                                </div>


                                {/* Progress bar */}

                                <div className="mt-5">

                                    <div className="w-full bg-slate-200 rounded-full h-3">

                                        <div
                                            className="bg-blue-600 h-3 rounded-full"
                                            style={{
                                                width: `${Math.min(
                                                    overallPercentage,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Course Attendance */}

                            <div className="mb-8">

                                <h2 className="text-xl font-bold text-slate-800 mb-4">
                                    Course-wise Attendance
                                </h2>


                                {courses.length === 0 ? (

                                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                                        <h3 className="text-lg font-semibold text-slate-700">
                                            No Courses Found
                                        </h3>

                                        <p className="text-slate-500 mt-2">
                                            You currently have no enrolled courses.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                        {courses.map(
                                            (course) => (

                                                <div
                                                    key={
                                                        course.courseOfferingId
                                                    }
                                                    className="bg-white rounded-xl shadow-sm p-6"
                                                >

                                                    <div className="flex justify-between items-start">

                                                        <div>

                                                            <p className="text-sm font-semibold text-blue-600">
                                                                {course.code}
                                                            </p>

                                                            <h3 className="text-lg font-semibold text-slate-800 mt-1">
                                                                {course.name}
                                                            </h3>

                                                        </div>


                                                        <span className="text-sm text-slate-500">
                                                            {course.credit} Credit
                                                        </span>

                                                    </div>


                                                    <p className="text-sm text-slate-500 mt-2">
                                                        {course.semester}
                                                    </p>


                                                    <div className="mt-5">

                                                        <div className="flex justify-between mb-2">

                                                            <span className="text-sm text-slate-600">
                                                                Attendance
                                                            </span>

                                                            <span className="text-sm font-semibold text-slate-800">
                                                                {course.percentage}%
                                                            </span>

                                                        </div>


                                                        <div className="w-full bg-slate-200 rounded-full h-2.5">

                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        course.percentage,
                                                                        100
                                                                    )}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>


                                                    <div className="grid grid-cols-3 gap-3 mt-6">

                                                        <div className="bg-slate-50 rounded-lg p-3">

                                                            <p className="text-xs text-slate-500">
                                                                Attended
                                                            </p>

                                                            <p className="font-semibold text-slate-800 mt-1">
                                                                {course.attendedClasses}
                                                            </p>

                                                        </div>


                                                        <div className="bg-slate-50 rounded-lg p-3">

                                                            <p className="text-xs text-slate-500">
                                                                Total
                                                            </p>

                                                            <p className="font-semibold text-slate-800 mt-1">
                                                                {course.totalClasses}
                                                            </p>

                                                        </div>


                                                        <div className="bg-slate-50 rounded-lg p-3">

                                                            <p className="text-xs text-slate-500">
                                                                Marks
                                                            </p>

                                                            <p className="font-semibold text-slate-800 mt-1">
                                                                {course.attendanceMarks}/10
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* Attendance History */}

                            <div>

                                <h2 className="text-xl font-bold text-slate-800 mb-4">
                                    Attendance History
                                </h2>


                                {attendanceRecords.length === 0 ? (

                                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">

                                        <h3 className="text-lg font-semibold text-slate-700">
                                            No Attendance Records
                                        </h3>

                                        <p className="text-slate-500 mt-2">
                                            No attendance has been recorded yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                                        <div className="overflow-x-auto">

                                            <table className="w-full">

                                                <thead className="bg-slate-50 border-b border-slate-200">

                                                    <tr>

                                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                                            Date
                                                        </th>

                                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                                            Course
                                                        </th>

                                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                                            Class Time
                                                        </th>

                                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                                            Room
                                                        </th>

                                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                                            Status
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody className="divide-y divide-slate-100">

                                                    {[...attendanceRecords]
                                                        .sort(
                                                            (a, b) =>
                                                                new Date(
                                                                    b.classSession?.date
                                                                ) -
                                                                new Date(
                                                                    a.classSession?.date
                                                                )
                                                        )
                                                        .map(
                                                            (record) => {

                                                                const session =
                                                                    record.classSession;

                                                                const course =
                                                                    session?.courseOffering?.course;


                                                                return (

                                                                    <tr
                                                                        key={
                                                                            record.id
                                                                        }
                                                                        className="hover:bg-slate-50"
                                                                    >

                                                                        <td className="px-6 py-4 text-sm text-slate-700">

                                                                            {formatDate(
                                                                                session?.date
                                                                            )}

                                                                        </td>


                                                                        <td className="px-6 py-4">

                                                                            <p className="text-sm font-semibold text-blue-600">
                                                                                {course?.code || "N/A"}
                                                                            </p>

                                                                            <p className="text-sm text-slate-600">
                                                                                {course?.name || "N/A"}
                                                                            </p>

                                                                        </td>


                                                                        <td className="px-6 py-4 text-sm text-slate-600">

                                                                            {session?.startTime
                                                                                ? new Date(
                                                                                    session.startTime
                                                                                ).toLocaleTimeString(
                                                                                    "en-US",
                                                                                    {
                                                                                        hour: "numeric",
                                                                                        minute: "2-digit",
                                                                                        hour12: true
                                                                                    }
                                                                                )
                                                                                : "N/A"}

                                                                            {" - "}

                                                                            {session?.endTime
                                                                                ? new Date(
                                                                                    session.endTime
                                                                                ).toLocaleTimeString(
                                                                                    "en-US",
                                                                                    {
                                                                                        hour: "numeric",
                                                                                        minute: "2-digit",
                                                                                        hour12: true
                                                                                    }
                                                                                )
                                                                                : "N/A"}

                                                                        </td>


                                                                        <td className="px-6 py-4 text-sm text-slate-600">

                                                                            {session?.room ||
                                                                                "Not assigned"}

                                                                        </td>


                                                                        <td className="px-6 py-4">

                                                                            <span
                                                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                                                                    record.status
                                                                                )}`}
                                                                            >
                                                                                {record.status}
                                                                            </span>

                                                                        </td>

                                                                    </tr>

                                                                );

                                                            }
                                                        )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </>

                    )}

                </div>

            </main>

        </div>

    );

};


export default Attendance;