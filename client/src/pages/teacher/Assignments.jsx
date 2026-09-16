import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";

import {
  getAssignmentsByCourseOffering,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAssignmentAttachment,
} from "../../services/assignmentApi";

import {
  getSubmissionsByAssignment,
  updateSubmission,
  downloadSubmissionFile,
} from "../../services/assignmentSubmissionApi";

function Assignments() {
  const [searchParams] = useSearchParams();

  const [teacherCourses, setTeacherCourses] = useState([]);
  const [teacherId, setTeacherId] = useState(null);

  const [assignments, setAssignments] = useState([]);

  const [selectedCourseId, setSelectedCourseId] = useState(
    searchParams.get("courseOfferingId") || ""
  );

  // Assignment form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignmentFile, setAssignmentFile] = useState(null);

  // Editing
  const [editingAssignment, setEditingAssignment] =
    useState(null);

  // Submissions
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [marksInput, setMarksInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState({});

  const [now, setNow] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] =
    useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ----------------------------
  // Load Teacher Courses
  // ----------------------------
  const loadTeacherCourses = async () => {
    const response = await getAllTeacherAssignments();

    const data = response?.data || response || [];

    const teacherAssignments = Array.isArray(data)
      ? data.filter(
          (assignment) =>
            Number(assignment.teacher?.userId) ===
            Number(user?.id)
        )
      : [];

    if (teacherAssignments.length > 0) {
      setTeacherId(teacherAssignments[0].teacherId);
    }

    setTeacherCourses(teacherAssignments);
  };

  // ----------------------------
  // Load Assignments for course
  // ----------------------------
  const loadAssignments = async (courseOfferingId) => {
    if (!courseOfferingId) {
      setAssignments([]);
      return;
    }

    try {
      const response =
        await getAssignmentsByCourseOffering(
          courseOfferingId
        );

      const data = response?.data || response || [];

      setAssignments(Array.isArray(data) ? data : []);

      setNow(new Date().getTime());
    } catch (error) {
      console.error(error);

      setAssignments([]);
    }
  };

  // ----------------------------
  // Initial Load
  // ----------------------------
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        await loadTeacherCourses();
      } catch (error) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            "Failed to load assignments."
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ----------------------------
  // Load assignments when course changes
  // ----------------------------
  useEffect(() => {
    if (teacherId && selectedCourseId) {
      loadAssignments(selectedCourseId);
      setSelectedAssignment(null);
      setSubmissions([]);
    }
  }, [teacherId, selectedCourseId]);

  // ----------------------------
  // Create / Update Assignment
  // ----------------------------
  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Assignment title is required.");
      return;
    }

    if (!deadline) {
      setError("Deadline is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingAssignment) {
        await updateAssignment(
          editingAssignment.id,
          {
            title: title.trim(),
            description: description.trim() || null,
            deadline: new Date(deadline).toISOString(),
          },
          assignmentFile || null
        );

        setSuccess("Assignment updated successfully.");
      } else {
        await createAssignment(
          selectedCourseId,
          teacherId,
          title.trim(),
          description.trim() || null,
          new Date(deadline).toISOString(),
          assignmentFile || null
        );

        setSuccess("Assignment created successfully.");
      }

      setTitle("");
      setDescription("");
      setDeadline("");
      setAssignmentFile(null);
      setEditingAssignment(null);
      setShowForm(false);

      await loadAssignments(selectedCourseId);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to save assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Open Edit Form
  // ----------------------------
  const handleEditAssignment = (assignment) => {
    setError("");
    setSuccess("");

    setEditingAssignment(assignment);
    setTitle(assignment.title || "");
    setDescription(assignment.description || "");
    setAssignmentFile(null);

    if (assignment.deadline) {
      const d = new Date(assignment.deadline);
      const local = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
      );
      setDeadline(local.toISOString().slice(0, 16));
    } else {
      setDeadline("");
    }

    setShowForm(true);
  };

  // ----------------------------
  // Cancel / Reset form
  // ----------------------------
  const resetAssignmentForm = () => {
    setTitle("");
    setDescription("");
    setDeadline("");
    setAssignmentFile(null);
    setEditingAssignment(null);
    setShowForm(false);
  };

  // ----------------------------
  // Delete Assignment
  // ----------------------------
  const handleDeleteAssignment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteAssignment(id);

      setSuccess("Assignment deleted successfully.");

      if (selectedAssignment?.id === id) {
        setSelectedAssignment(null);
        setSubmissions([]);
      }

      await loadAssignments(selectedCourseId);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to delete assignment."
      );
    }
  };

  // ----------------------------
  // View Submissions
  // ----------------------------
  const handleViewSubmissions = async (assignment) => {
    setError("");
    setSuccess("");

    try {
      setLoadingSubmissions(true);
      setSelectedAssignment(assignment);
      setSubmissions([]);

      const response =
        await getSubmissionsByAssignment(assignment.id);

      const data = response?.data || response || [];

      const list = Array.isArray(data) ? data : [];

      setSubmissions(list);

      const marksMap = {};
      const feedbackMap = {};

      list.forEach((submission) => {
        marksMap[submission.id] = submission.marks ?? "";
        feedbackMap[submission.id] =
          submission.feedback || "";
      });

      setMarksInput(marksMap);
      setFeedbackInput(feedbackMap);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to load submissions."
      );
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // ----------------------------
  // Grade Submission
  // ----------------------------
  const handleGradeSubmission = async (submission) => {
    setError("");
    setSuccess("");

    try {
      await updateSubmission(submission.id, {
        marks: marksInput[submission.id] || 0,
        feedback: feedbackInput[submission.id] || null,
      });

      setSuccess("Submission graded successfully.");

      await handleViewSubmissions(selectedAssignment);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to grade submission."
      );
    }
  };

  // ----------------------------
  // Download handlers
  // ----------------------------
  const handleDownloadAssignmentAttachment = async (id) => {
    setError("");
    setSuccess("");

    try {
      await downloadAssignmentAttachment(id);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to download attachment."
      );
    }
  };

  const handleDownloadSubmissionFile = async (submission) => {
    setError("");
    setSuccess("");

    try {
      await downloadSubmissionFile(submission.id);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to download submission file."
      );
    }
  };

  // ----------------------------
  // Helpers
  // ----------------------------
  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getSelectedCourse = () => {
    return teacherCourses.find(
      (course) =>
        Number(course.courseOfferingId) ===
        Number(selectedCourseId)
    );
  };

  const isOverdue = (assignment) => {
    return (
      assignment.deadline &&
      new Date(assignment.deadline).getTime() < now
    );
  };

  return (
    <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Assignment Management
          </h1>

          <p className="mt-2 text-slate-400">
            Create assignments, review submissions and grade
            your students.
          </p>
        </div>

        {success && (
          <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white/[0.03] rounded-xl shadow p-8 text-center text-slate-400">
            Loading assignments...
          </div>
        ) : (
          <>
            {/* Course Selector */}
            <div className="bg-white/[0.03] rounded-xl shadow p-6 mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Select Course
              </label>

              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSuccess("");
                  setError("");
                }}
                className="w-full md:w-96 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select a course</option>

                {teacherCourses.map((course) => (
                  <option
                    key={course.id}
                    value={course.courseOfferingId}
                  >
                    {course.courseOffering?.course?.code} —{" "}
                    {course.courseOffering?.course?.name} (
                    {course.section?.name || "No Section"})
                  </option>
                ))}
              </select>
            </div>

            {!selectedCourseId ? (
              <div className="bg-white/[0.03] rounded-xl shadow p-10 text-center text-slate-400">
                Please select a course to manage its
                assignments.
              </div>
            ) : (
              <>
                {/* Create Assignment */}
                <div className="bg-white/[0.03] rounded-xl shadow mb-6 overflow-hidden">
                  <div className="flex items-center justify-between border-b px-6 py-5">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">
                        Assignments
                      </h2>

                      <p className="text-sm text-slate-400">
                        {getSelectedCourse()?.courseOffering
                          ?.course?.name || "Course"}{" "}
                        — Total: {assignments.length}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (showForm) {
                          resetAssignmentForm();
                        } else {
                          setShowForm(true);
                        }
                        setError("");
                        setSuccess("");
                      }}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                    >
                      {showForm
                        ? "Cancel"
                        : "+ Create Assignment"}
                    </button>
                  </div>

                  {showForm && (
                    <div className="border-b bg-white/5 p-6">
                      <h3 className="mb-4 text-lg font-semibold text-slate-100">
                        {editingAssignment
                          ? `Edit Assignment: ${editingAssignment.title}`
                          : "Create New Assignment"}
                      </h3>

                      <form onSubmit={handleCreateAssignment}>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-200">
                              Title
                            </label>

                            <input
                              type="text"
                              value={title}
                              onChange={(e) =>
                                setTitle(e.target.value)
                              }
                              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              placeholder="e.g. Chapter 3 Exercises"
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-200">
                              Description
                            </label>

                            <input
                              type="text"
                              value={description}
                              onChange={(e) =>
                                setDescription(
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              placeholder="Short description"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-200">
                              Deadline
                            </label>

                            <input
                              type="datetime-local"
                              value={deadline}
                              onChange={(e) =>
                                setDeadline(e.target.value)
                              }
                              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-5">
                          <label className="mb-2 block text-sm font-medium text-slate-200">
                            Attachment (optional)
                          </label>

                          <input
                            type="file"
                            onChange={(e) =>
                              setAssignmentFile(
                                e.target.files[0] || null
                              )
                            }
                            className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />

                          {assignmentFile && (
                            <p className="mt-2 text-sm text-slate-300">
                              Selected file: {assignmentFile.name}
                            </p>
                          )}
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving
                              ? editingAssignment
                                ? "Saving..."
                                : "Creating..."
                              : editingAssignment
                                ? "Save Changes"
                                : "Create Assignment"}
                          </button>

                          <button
                            type="button"
                            onClick={resetAssignmentForm}
                            className="rounded-lg bg-gray-500 px-6 py-2.5 font-medium text-white hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Assignments List */}
                  {assignments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No assignments for this course yet.
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-white/5 text-left">
                        <tr className="border-b">
                          <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                            #
                          </th>

                          <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                            Title
                          </th>

                          <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                            Description
                          </th>

                          <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                            Deadline
                          </th>

                          <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                            Submissions
                          </th>

                          <th className="px-5 py-3 text-center text-sm font-semibold text-slate-200">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-white/10">
                        {assignments.map((assignment, index) => {
                          const count = Array.isArray(
                            assignment.submissions
                          )
                            ? assignment.submissions.length
                            : 0;

                          return (
                            <tr
                              key={assignment.id}
                              className="hover:bg-white/5"
                            >
                              <td className="px-5 py-4 text-sm text-slate-300">
                                {index + 1}
                              </td>

                              <td className="px-5 py-4 font-medium text-slate-100">
                                {assignment.title}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-300 max-w-xs">
                                {assignment.description || "-"}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-200">
                                <span
                                  className={
                                    isOverdue(assignment)
                                      ? "text-red-400"
                                      : ""
                                  }
                                >
                                  {formatDate(
                                    assignment.deadline
                                  )}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-200">
                                {count} submission(s)
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex justify-center gap-2">
                                  {assignment.attachmentName && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDownloadAssignmentAttachment(
                                          assignment.id
                                        )
                                      }
                                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                    >
                                      Download
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewSubmissions(
                                        assignment
                                      )
                                    }
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                  >
                                    Submissions
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditAssignment(
                                        assignment
                                      )
                                    }
                                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteAssignment(
                                        assignment.id
                                      )
                                    }
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Submissions Section */}
                {selectedAssignment && (
                  <div className="bg-white/[0.03] rounded-xl shadow overflow-hidden">
                    <div className="border-b px-6 py-5">
                      <h2 className="text-xl font-semibold text-slate-100">
                        Submissions — {selectedAssignment.title}
                      </h2>

                      <p className="text-sm text-slate-400">
                        Grade and provide feedback for student
                        submissions.
                      </p>
                    </div>

                    {loadingSubmissions ? (
                      <div className="p-8 text-center text-slate-400">
                        Loading submissions...
                      </div>
                    ) : submissions.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        No submissions for this assignment yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white/5 text-left">
                            <tr className="border-b">
                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                #</th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Student
                              </th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Submission
                              </th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Submitted
                              </th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Marks
                              </th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Feedback
                              </th>

                              <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                                Current Grade
                              </th>

                              <th className="px-5 py-3 text-center text-sm font-semibold text-slate-200">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-white/10">
                            {submissions.map((submission, index) => (
                              <tr
                                key={submission.id}
                                className="hover:bg-white/5"
                              >
                                <td className="px-5 py-4 text-sm text-slate-300">
                                  {index + 1}
                                </td>

                                <td className="px-5 py-4">
                                  <p className="font-medium text-slate-100">
                                    {submission.student?.name ||
                                      "Unknown"}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {submission.student
                                      ?.studentId || ""}
                                  </p>
                                </td>

                                <td className="px-5 py-4">
                                  {submission.fileName ? (
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-slate-200 break-words max-w-[8rem]">
                                        {submission.fileName}
                                      </p>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDownloadSubmissionFile(
                                            submission
                                          )
                                        }
                                        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                                      >
                                        Download
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-slate-500">
                                      No file
                                    </p>
                                  )}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-200">
                                  {formatDate(
                                    submission.submittedAt
                                  )}
                                </td>

                                <td className="px-5 py-4">
                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      marksInput[
                                        submission.id
                                      ] ?? ""
                                    }
                                    onChange={(e) =>
                                      setMarksInput((prev) => ({
                                        ...prev,
                                        [submission.id]:
                                          e.target.value,
                                      }))
                                    }
                                    className="w-24 rounded-lg border border-white/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Marks"
                                  />
                                </td>

                                <td className="px-5 py-4">
                                  <input
                                    type="text"
                                    value={
                                      feedbackInput[
                                        submission.id
                                      ] ?? ""
                                    }
                                    onChange={(e) =>
                                      setFeedbackInput(
                                        (prev) => ({
                                          ...prev,
                                          [submission.id]:
                                            e.target.value,
                                        })
                                      )
                                    }
                                    className="w-full rounded-lg border border-white/15 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder="Feedback"
                                  />
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-200">
                                  {submission.marks !== null &&
                                  submission.marks !== undefined
                                    ? `${submission.marks} marks`
                                    : "Not graded"}
                                </td>

                                <td className="px-5 py-4">
                                  <div className="flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleGradeSubmission(
                                          submission
                                        )
                                      }
                                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                    >
                                      Save Grade
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
    </>
  );
}

export default Assignments;