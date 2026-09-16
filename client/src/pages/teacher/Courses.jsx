import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, Trash2 } from "lucide-react";

import {
    getAllTeacherAssignments
} from "../../services/teacherAssignmentApi";
import {
    getMaterialsByCourseOffering,
    uploadCourseMaterial,
    downloadCourseMaterialFile,
    deleteCourseMaterial
} from "../../services/courseMaterialApi";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

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
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="ec-page">
                <PageHeader
                    title="My Courses"
                    subtitle="Courses assigned to you"
                />

                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="ec-page">

            {/* Header */}

            <PageHeader
                title="My Courses"
                subtitle="Courses assigned to you"
                actions={[
                    <span
                        key="total"
                        className="ec-badge ec-badge-indigo"
                    >
                        {assignments.length} Total Courses
                    </span>,
                ]}
            />


            {/* Messages */}

            {materialError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {materialError}
                </div>
            )}

            {materialSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {materialSuccess}
                </div>
            )}


            {/* Assigned Courses List */}

            <div className="ec-card overflow-hidden">

                {/* List Header */}

                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-base font-semibold text-slate-900">
                            Assigned Courses
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                            View the courses, semesters and sections assigned to you.
                        </p>

                    </div>

                </div>

                {assignments.length === 0 ? (

                    <EmptyState
                        icon={BookOpen}
                        title="No Courses Assigned"
                        description="You currently have no courses assigned to you."
                    />

                ) : (

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">

                        {assignments.map((assignment) => (

                            <div
                                key={assignment.id}
                                className="ec-card flex flex-col overflow-hidden"
                            >

                                {/* Card Header */}

                                <div className="border-b border-slate-100 p-6">

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                                Course
                                            </p>

                                            <h3 className="text-xl font-bold text-slate-900 mt-2">
                                                {assignment.courseOffering?.course?.code}
                                            </h3>

                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                            <BookOpen size={20} />
                                        </div>

                                    </div>

                                    <p className="text-sm font-medium text-slate-700 mt-3">
                                        {assignment.courseOffering?.course?.name}
                                    </p>

                                </div>

                                {/* Card Details */}

                                <div className="flex-1 space-y-4 p-6">

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
                                            className="ec-btn ec-btn-primary w-full"
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
                                                                className="rounded-xl border border-slate-200 p-3"
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
                                                                            aria-label="Download material"
                                                                            className="ec-icon-btn"
                                                                        >
                                                                            <Download size={16} />
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteMaterial(
                                                                                    material.id,
                                                                                    assignment.courseOfferingId
                                                                                )
                                                                            }
                                                                            aria-label="Delete material"
                                                                            className="ec-icon-btn ec-icon-btn-danger"
                                                                        >
                                                                            <Trash2 size={16} />
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
                                                className="ec-stack mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                                            >
                                                <div className="ec-field md:mb-0">
                                                    <label className="ec-label">
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
                                                        className="ec-input"
                                                        placeholder="Material title"
                                                    />
                                                </div>

                                                <div className="ec-field md:mb-0">
                                                    <label className="ec-label">
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
                                                        className="ec-textarea"
                                                        placeholder="Short description"
                                                    />
                                                </div>

                                                <div className="ec-field md:mb-0">
                                                    <label className="ec-label">
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
                                                    className="ec-btn ec-btn-primary w-full"
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

        </div>
    );
}

export default TeacherCourses;