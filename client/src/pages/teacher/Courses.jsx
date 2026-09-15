import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getAllTeacherAssignments
} from "../../services/teacherAssignmentApi";
import {
    getMaterialsByCourseOffering,
    uploadCourseMaterial,
    downloadCourseMaterialFile,
    deleteCourseMaterial
} from "../../services/courseMaterialApi";

function TeacherCourses() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [materialsByCourse, setMaterialsByCourse] = useState(
        {}
    );
    const [loadingMaterials, setLoadingMaterials] = useState(
        {}
    );
    const [showUploadCourse, setShowUploadCourse] = useState(
        {}
    );
    const [materialForm, setMaterialForm] = useState({});
    const [materialSaving, setMaterialSaving] = useState(false);
    const [materialError, setMaterialError] = useState("");
    const [materialSuccess, setMaterialSuccess] = useState("");

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

    const loadMaterials = async (courseOfferingId) => {
        setLoadingMaterials((prev) => ({
            ...prev,
            [courseOfferingId]: true
        }));

        try {
            const response =
                await getMaterialsByCourseOffering(
                    courseOfferingId
                );

            const data = Array.isArray(response)
                ? response
                : response?.data || [];

            setMaterialsByCourse((prev) => ({
                ...prev,
                [courseOfferingId]: data
            }));
        } catch (error) {
            console.error(error);

            setMaterialsByCourse((prev) => ({
                ...prev,
                [courseOfferingId]: []
            }));
        } finally {
            setLoadingMaterials((prev) => ({
                ...prev,
                [courseOfferingId]: false
            }));
        }
    };

    const toggleMaterialSection = (courseOfferingId) => {
        const next =
            !materialsByCourse[courseOfferingId] &&
            !loadingMaterials[courseOfferingId];

        setShowUploadCourse((prev) => ({
            ...prev,
            [courseOfferingId]: next
        }));

        setMaterialError("");
        setMaterialSuccess("");

        if (!materialsByCourse[courseOfferingId]) {
            loadMaterials(courseOfferingId);
        }
    };

    const handleMaterialInput = (courseOfferingId, field, value) => {
        setMaterialForm((prev) => ({
            ...prev,
            [courseOfferingId]: {
                ...prev[courseOfferingId],
                [field]: value
            }
        }));
    };

    const handleUploadMaterial = async (e, courseOfferingId) => {
        e.preventDefault();

        setMaterialError("");
        setMaterialSuccess("");

        const form = materialForm[courseOfferingId] || {};

        if (!form.title || !form.title.trim()) {
            setMaterialError("Material title is required.");
            return;
        }

        try {
            setMaterialSaving(true);

            await uploadCourseMaterial(
                courseOfferingId,
                form.title.trim(),
                form.description ? form.description.trim() : null,
                form.file || null
            );

            setMaterialSuccess("Material uploaded successfully.");

            setMaterialForm((prev) => ({
                ...prev,
                [courseOfferingId]: {
                    title: "",
                    description: "",
                    file: null
                }
            }));

            setShowUploadCourse((prev) => ({
                ...prev,
                [courseOfferingId]: false
            }));

            await loadMaterials(courseOfferingId);
        } catch (error) {
            console.error(error);

            setMaterialError(
                error?.response?.data?.message ||
                    "Failed to upload material."
            );
        } finally {
            setMaterialSaving(false);
        }
    };

    const handleDownloadMaterial = async (id) => {
        try {
            await downloadCourseMaterialFile(id);
        } catch (error) {
            console.error(error);

            setMaterialError("Failed to download material.");
        }
    };

    const handleDeleteMaterial = async (id, courseOfferingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this material?"
        );

        if (!confirmed) return;

        setMaterialError("");
        setMaterialSuccess("");

        try {
            await deleteCourseMaterial(id);

            setMaterialSuccess("Material deleted successfully.");

            await loadMaterials(courseOfferingId);
        } catch (error) {
            console.error(error);

            setMaterialError(
                error?.response?.data?.message ||
                    "Failed to delete material."
            );
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <p className="text-slate-500">
                    Loading courses...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl border border-red-200 p-8">
                <h2 className="text-xl font-semibold text-slate-900">
                    My Courses
                </h2>

                <p className="text-red-500 mt-3">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <>

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

                    {materialError && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                            {materialError}
                        </div>
                    )}

                    {materialSuccess && (
                        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                            {materialSuccess}
                        </div>
                    )}

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

                                        {/* Materials */}
                                        <div className="pt-3 border-t border-slate-100">

                                            <div className="flex items-center justify-between">

                                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                    Materials
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleMaterialSection(
                                                            assignment.courseOfferingId
                                                        )
                                                    }
                                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                                >
                                                    {showUploadCourse[
                                                        assignment.courseOfferingId
                                                    ]
                                                        ? "Cancel"
                                                        : "+ Upload"}
                                                </button>

                                            </div>

                                            {loadingMaterials[
                                                assignment.courseOfferingId
                                            ] ? (
                                                <p className="text-xs text-slate-400 mt-3">
                                                    Loading materials...
                                                </p>
                                            ) : (
                                                <>
                                                    {(materialsByCourse[
                                                        assignment.courseOfferingId
                                                    ] || []).length === 0 ? (
                                                        <p className="text-xs text-slate-400 mt-3">
                                                            No materials uploaded yet.
                                                        </p>
                                                    ) : (
                                                        <div className="mt-3 space-y-2">
                                                            {(
                                                                materialsByCourse[
                                                                    assignment
                                                                        .courseOfferingId
                                                                ] || []
                                                            ).map((material) => (
                                                                <div
                                                                    key={material.id}
                                                                    className="border border-slate-200 rounded-lg p-3"
                                                                >
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="min-w-0">
                                                                            <p className="text-sm font-medium text-slate-800 break-words">
                                                                                {material.title}
                                                                            </p>

                                                                            {material.description && (
                                                                                <p className="text-xs text-slate-500 mt-1 break-words">
                                                                                    {material.description}
                                                                                </p>
                                                                            )}

                                                                            <p className="text-xs text-slate-400 mt-1">
                                                                                {material.createdAt
                                                                                    ? new Date(
                                                                                          material.createdAt
                                                                                      ).toLocaleDateString(
                                                                                          "en-GB",
                                                                                          {
                                                                                              day: "2-digit",
                                                                                              month: "short",
                                                                                              year: "numeric"
                                                                                          }
                                                                                      )
                                                                                    : "-"}
                                                                            </p>
                                                                        </div>

                                                                        <div className="flex gap-1.5 shrink-0">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDownloadMaterial(
                                                                                        material.id
                                                                                    )
                                                                                }
                                                                                className="rounded-md bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-indigo-700"
                                                                            >
                                                                                Download
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDeleteMaterial(
                                                                                        material.id,
                                                                                        assignment.courseOfferingId
                                                                                    )
                                                                                }
                                                                                className="rounded-md bg-red-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-700"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {showUploadCourse[
                                                assignment.courseOfferingId
                                            ] && (
                                                <form
                                                    onSubmit={(e) =>
                                                        handleUploadMaterial(
                                                            e,
                                                            assignment.courseOfferingId
                                                        )
                                                    }
                                                    className="mt-3 space-y-3 border border-slate-200 rounded-lg p-3 bg-slate-50"
                                                >
                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-slate-600">
                                                            Title
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                (materialForm[
                                                                    assignment
                                                                        .courseOfferingId
                                                                ] || {}).title || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMaterialInput(
                                                                    assignment.courseOfferingId,
                                                                    "title",
                                                                    e.target.value
                                                                )
                                                            }
                                                            required
                                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                            placeholder="Material title"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-slate-600">
                                                            Description
                                                            (optional)
                                                        </label>

                                                        <textarea
                                                            value={
                                                                (materialForm[
                                                                    assignment
                                                                        .courseOfferingId
                                                                ] || {}).description || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMaterialInput(
                                                                    assignment.courseOfferingId,
                                                                    "description",
                                                                    e.target.value
                                                                )
                                                            }
                                                            rows="2"
                                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                                            placeholder="Short description"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="mb-1 block text-xs font-medium text-slate-600">
                                                            File
                                                        </label>

                                                        <input
                                                            type="file"
                                                            onChange={(e) =>
                                                                handleMaterialInput(
                                                                    assignment.courseOfferingId,
                                                                    "file",
                                                                    e.target.files[0] ||
                                                                        null
                                                                )
                                                            }
                                                            className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={materialSaving}
                                                        className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        {materialSaving
                                                            ? "Uploading..."
                                                            : "Upload Material"}
                                                    </button>
                                                </form>
                                            )}

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

        </>
    );
}

export default TeacherCourses;