import { useEffect, useState } from "react";

import StudentSidebar from "../../components/StudentSidebar";

import { getStudentByUserId } from "../../services/studentApi";
import { getEnrollmentsByStudentId } from "../../services/enrollmentApi";
import {
    getMaterialsByCourseOffering,
    downloadCourseMaterialFile,
} from "../../services/courseMaterialApi";

function MyCourses() {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [materials, setMaterials] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                setLoading(true);
                setError("");

                // Get logged-in user
                const storedUser =
                    JSON.parse(localStorage.getItem("user"));

                if (!storedUser) {
                    setError("User information not found.");
                    return;
                }

                // Get logged-in student
                const currentStudent = await getStudentByUserId(
                    storedUser.id
                );

                if (!currentStudent) {
                    setError("Student information not found.");
                    return;
                }

                setStudent(currentStudent);

                // Get student's enrollments
                const enrollments =
                    await getEnrollmentsByStudentId(
                        currentStudent.id
                    );

                setCourses(enrollments);

                // Get materials for each course offering
                const materialMap = {};

                const studentEnrollments =
                    Array.isArray(enrollments)
                        ? enrollments
                        : enrollments?.data || [];

                await Promise.all(
                    studentEnrollments.map(
                        async (enrollment) => {
                            const offeringId =
                                enrollment.courseOfferingId;

                            if (!offeringId) return;

                            try {
                                const materialResponse =
                                    await getMaterialsByCourseOffering(
                                        offeringId
                                    );

                                materialMap[
                                    offeringId
                                ] = Array.isArray(
                                    materialResponse
                                )
                                    ? materialResponse
                                    : materialResponse?.data ||
                                      [];
                            } catch {
                                materialMap[
                                    offeringId
                                ] = [];
                            }
                        }
                    )
                );

                setMaterials(materialMap);
            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load courses."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 flex">

            {/* Sidebar */}
            <StudentSidebar />


            {/* Main Content */}
            <main className="ml-64 flex-1">

                {/* Topbar */}
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">

                    <div>
                        <p className="text-sm text-slate-500">
                            Student Portal
                        </p>

                        <h2 className="text-2xl font-bold text-slate-800">
                            My Courses
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            View your enrolled courses and academic information.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-700">
                                {student?.name || "Student"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {student?.studentId || ""}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
                            {student?.name
                                ? student.name.charAt(0).toUpperCase()
                                : "S"}
                        </div>

                    </div>

                </header>


                {/* Page Body */}
                <div className="p-8">

                    {/* Loading */}
                    {loading && (
                        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                            <p className="text-slate-500">
                                Loading your courses...
                            </p>
                        </div>
                    )}


                    {/* Error */}
                    {!loading && error && (
                        <div className="bg-white rounded-xl border border-red-200 p-6">
                            <p className="text-red-600 font-medium">
                                {error}
                            </p>
                        </div>
                    )}


                    {/* Content */}
                    {!loading && !error && (
                        <>

                            {/* Student Info */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Enrolled Student
                                        </p>

                                        <h3 className="text-xl font-bold text-slate-800 mt-1">
                                            {student?.name}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Student ID: {student?.studentId}
                                        </p>
                                    </div>

                                    <div className="text-right">

                                        <p className="text-sm text-slate-500">
                                            Total Courses
                                        </p>

                                        <p className="text-3xl font-bold text-slate-800">
                                            {courses.length}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Courses */}
                            <div className="mb-5">

                                <h3 className="text-xl font-bold text-slate-800">
                                    Enrolled Courses
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Courses you are currently enrolled in.
                                </p>

                            </div>


                            {courses.length === 0 ? (

                                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">

                                    <div className="text-4xl mb-3">
                                        📚
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-700">
                                        No Courses Found
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        You are not enrolled in any courses yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                    {courses.map((enrollment) => {

                                        const course =
                                            enrollment.courseOffering?.course;

                                        const semester =
                                            enrollment.courseOffering
                                                ?.academicSemester;

                                        const section =
                                            enrollment.section;

                                        const offeringMaterials =
                                            materials[
                                                Number(
                                                    enrollment.courseOfferingId
                                                )
                                            ] || [];

                                        return (
                                            <div
                                                key={enrollment.id}
                                                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
                                            >

                                                {/* Course Code */}
                                                <div className="flex items-start justify-between mb-5">

                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                                                        📚
                                                    </div>

                                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                                        {course?.credit || "-"} Credit
                                                    </span>

                                                </div>


                                                {/* Course */}
                                                <p className="text-sm font-semibold text-slate-500">
                                                    {course?.code || "N/A"}
                                                </p>

                                                <h3 className="text-xl font-bold text-slate-800 mt-1">
                                                    {course?.name || "Unknown Course"}
                                                </h3>


                                                {/* Details */}
                                                <div className="mt-5 space-y-3">

                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500">
                                                            Semester
                                                        </span>

                                                        <span className="font-medium text-slate-700 text-right">
                                                            {semester?.name || "N/A"}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500">
                                                            Section
                                                        </span>

                                                        <span className="font-medium text-slate-700">
                                                            {section?.name || "N/A"}
                                                        </span>
                                                    </div>

                                                </div>


                                                {/* Footer */}
                                                <div className="border-t border-slate-100 mt-5 pt-4">

                                                    <p className="text-xs text-slate-400">
                                                        Enrolled on
                                                    </p>

                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {enrollment.enrolledAt
                                                            ? new Date(
                                                                enrollment.enrolledAt
                                                            ).toLocaleDateString()
                                                            : "N/A"}
                                                    </p>

                                                </div>


                                                {/* Materials */}
                                                <div className="border-t border-slate-100 mt-5 pt-4">

                                                    <p className="text-xs text-slate-400">
                                                        Materials
                                                    </p>

                                                    {offeringMaterials.length === 0 ? (

                                                        <p className="text-sm text-slate-500 mt-1">
                                                            No materials uploaded yet.
                                                        </p>

                                                    ) : (

                                                        <div className="mt-2 space-y-3">

                                                            {offeringMaterials.map((material) => (

                                                                <div key={material.id}>

                                                                    <p className="text-sm font-medium text-slate-700">
                                                                        {material.title}
                                                                    </p>

                                                                    {material.description && (
                                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                                            {material.description}
                                                                        </p>
                                                                    )}

                                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                                        {material.teacher?.name || "Teacher"}

                                                                        {material.createdAt
                                                                            ? ` • ${new Date(
                                                                                material.createdAt
                                                                            ).toLocaleDateString()}`
                                                                            : ""}
                                                                    </p>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            downloadCourseMaterialFile(
                                                                                material.id
                                                                            )
                                                                        }
                                                                        className="mt-2 inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                                                    >
                                                                        Download
                                                                    </button>

                                                                </div>

                                                            ))}

                                                        </div>

                                                    )}

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>

                            )}

                        </>
                    )}

                </div>

            </main>

        </div>
    );
}

export default MyCourses;