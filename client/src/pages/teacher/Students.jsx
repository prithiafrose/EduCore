import { useEffect, useState } from "react";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";
import { getEnrollments } from "../../services/enrollmentApi";

function Students() {
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // LOAD TEACHER COURSES
    // --------------------------------------------------

    const loadTeacherCourses = async () => {
        const response = await getAllTeacherAssignments();

        const data = response?.data || response || [];

        const allAssignments = Array.isArray(data)
            ? data
            : [];

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        const teacherId = Number(user?.id);

        const courses = allAssignments.filter(
            (assignment) =>
                Number(assignment.teacher?.userId) === teacherId
        );

        return courses;
    };

    // --------------------------------------------------
    // LOAD ENROLLMENTS
    // --------------------------------------------------

    const loadEnrollments = async () => {
        const response = await getEnrollments();

        const data = response?.data || response || [];

        return Array.isArray(data)
            ? data
            : [];
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [
                    teacherCoursesData,
                    enrollmentsData,
                ] = await Promise.all([
                    loadTeacherCourses(),
                    loadEnrollments(),
                ]);

                if (cancelled) return;

                setTeacherCourses(
                    teacherCoursesData
                );

                setEnrollments(
                    enrollmentsData
                );

                setLoading(false);
            } catch (err) {
                if (cancelled) return;

                console.error(err);

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load students"
                );

                setLoading(false);
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    // --------------------------------------------------
    // EFFECTIVE COURSE
    // --------------------------------------------------

    const effectiveCourseId =
        selectedCourseId ||
        teacherCourses[0]?.courseOfferingId ||
        teacherCourses[0]?.courseOffering?.id ||
        "";

    // --------------------------------------------------
    // SELECTED COURSE
    // --------------------------------------------------

    const selectedCourse = teacherCourses.find(
        (course) =>
            Number(
                course.courseOfferingId ||
                course.courseOffering?.id
            ) === Number(effectiveCourseId)
    );

    // --------------------------------------------------
    // FILTER STUDENTS
    // --------------------------------------------------

    const courseStudents = enrollments.filter(
        (enrollment) =>
            Number(enrollment.courseOfferingId) ===
            Number(effectiveCourseId)
    );

    // --------------------------------------------------
    // GET STUDENT NAME
    // --------------------------------------------------

    const getStudentName = (student) => {
        if (!student) {
            return "N/A";
        }

        return (
            student.name ||
            student.fullName ||
            `${student.firstName || ""} ${
                student.lastName || ""
            }`.trim() ||
            student.user?.name ||
            student.user?.email ||
            "N/A"
        );
    };

    // --------------------------------------------------
    // GET STUDENT EMAIL
    // --------------------------------------------------

    const getStudentEmail = (student) => {
        if (!student) {
            return "N/A";
        }

        return (
            student.email ||
            student.user?.email ||
            "N/A"
        );
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="p-8">
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
                            Loading students...
                        </div>
                    </div>
        );
    }

    // --------------------------------------------------
    // ERROR
    // --------------------------------------------------

    if (error) {
        return (
            <div className="p-8">
                        <div className="bg-white rounded-xl shadow-sm p-10">
                            <p className="text-red-600">
                                {error}
                            </p>
                        </div>
                    </div>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <>
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-indigo-600">
                            Teacher Portal
                        </p>

                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Students
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            View students enrolled in your courses
                        </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm">
                        T
                    </div>
                </header>

                <div className="p-8">

                    {/* COURSE SELECTOR */}

                    <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Course
                        </label>

                        <select
                            value={effectiveCourseId}
                            onChange={(e) =>
                                setSelectedCourseId(
                                    e.target.value
                                )
                            }
                            className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >

                            {teacherCourses.length === 0 ? (
                                <option value="">
                                    No assigned courses
                                </option>
                            ) : (
                                teacherCourses.map(
                                    (course) => {
                                        const courseOffering =
                                            course.courseOffering;

                                        const id =
                                            course.courseOfferingId ||
                                            courseOffering?.id;

                                        const courseName =
                                            courseOffering?.course?.name ||
                                            courseOffering?.course?.title ||
                                            courseOffering?.course?.code ||
                                            `Course ${id}`;

                                        const courseCode =
                                            courseOffering?.course?.code ||
                                            "";

                                        return (
                                            <option
                                                key={id}
                                                value={id}
                                            >
                                                {courseCode
                                                    ? `${courseCode} - ${courseName}`
                                                    : courseName}
                                            </option>
                                        );
                                    }
                                )
                            )}

                        </select>

                    </div>

                    {/* COURSE INFORMATION */}

                    {selectedCourse && (
                        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">

                            <div className="flex flex-wrap gap-6">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Course
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {selectedCourse.courseOffering?.course?.name ||
                                            selectedCourse.courseOffering?.course?.title ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Course Code
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {selectedCourse.courseOffering?.course?.code ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Students
                                    </p>

                                    <p className="font-semibold text-gray-800">
                                        {courseStudents.length}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* STUDENT TABLE */}

                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                        <div className="px-6 py-5 border-b">

                            <h2 className="text-lg font-semibold text-gray-800">
                                Enrolled Students
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {courseStudents.length} student
                                {courseStudents.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                enrolled
                            </p>

                        </div>

                        {courseStudents.length === 0 ? (

                            <div className="p-10 text-center">

                                <p className="text-gray-500">
                                    No students are enrolled
                                    in this course.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-gray-50 border-b">

                                        <tr>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                #
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Student
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Email
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Enrollment ID
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Section
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y">

                                        {courseStudents.map(
                                            (
                                                enrollment,
                                                index
                                            ) => {

                                                const student =
                                                    enrollment.student;

                                                return (
                                                    <tr
                                                        key={
                                                            enrollment.id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {index + 1}
                                                        </td>

                                                        <td className="px-6 py-4">

                                                            <div className="font-medium text-gray-800">
                                                                {getStudentName(
                                                                    student
                                                                )}
                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {getStudentEmail(
                                                                student
                                                            )}
                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {enrollment.id}
                                                        </td>

                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            {enrollment.section?.name ||
                                                                enrollment.section?.code ||
                                                                "N/A"}
                                                        </td>

                                                    </tr>
                                                );
                                            }
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

export default Students;