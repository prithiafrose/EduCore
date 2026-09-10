import { useEffect, useState } from "react";

import StudentSidebar from "../../components/StudentSidebar";

import { getEnrollments } from "../../services/enrollmentApi";

import { getAllAssignments, downloadAssignmentAttachment } from "../../services/assignmentApi";

import {
  getSubmissionsByStudent,
  createSubmission,
  downloadSubmissionFile,
} from "../../services/assignmentSubmissionApi";

function Assignments() {
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([
    { id: null, title: "Select an assignment", courseOfferingId: "" },
  ]);
  const [allAssignments, setAllAssignments] = useState([]);

  const [submissions, setSubmissions] = useState([]);
  const [studentId, setStudentId] = useState(null);

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const [now, setNow] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ----------------------------
  // Load enrollments + submissions
  // ----------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Enrollments (to find student + course offerings)
      const enrollmentResponse =
        await getEnrollments();
      let myEnrollments =
        enrollmentResponse?.data || enrollmentResponse || [];

      if (!Array.isArray(myEnrollments)) myEnrollments = [];

      const filteredEnrollments = myEnrollments.filter(
        (enrollment) =>
          Number(enrollment.student?.userId) ===
          Number(user?.id)
      );

      setEnrollments(filteredEnrollments);

      const currentStudent =
        filteredEnrollments.find(
          (enrollment) => enrollment.student
        )?.student || null;

      if (currentStudent) {
        setStudentId(currentStudent.id);

        // All assignments (for this user's courses)
        const assignmentResponse =
          await getAllAssignments();
        let assignmentData =
          assignmentResponse?.data ||
          assignmentResponse ||
          [];

        if (!Array.isArray(assignmentData))
          assignmentData = [];

        const enrolledOfferingIds = filteredEnrollments.map(
          (enrollment) =>
            Number(enrollment.courseOfferingId)
        );

        const relevantAssignments = assignmentData.filter(
          (assignment) =>
            enrolledOfferingIds.includes(
              Number(assignment.courseOfferingId)
            )
        );

        setAllAssignments(relevantAssignments);

        // Submissions by this student
        const submissionResponse =
          await getSubmissionsByStudent(currentStudent.id);

        const submissionData =
          submissionResponse?.data ||
          submissionResponse ||
          [];

        setSubmissions(
          Array.isArray(submissionData) ? submissionData : []
        );

        setNow(new Date().getTime());

        if (relevantAssignments.length > 0) {
          setAssignments([
            {
              id: null,
              title: "Select an assignment",
              courseOfferingId: "",
            },
            ...relevantAssignments,
          ]);
        }
      }
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

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------
  // Submit Assignment
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedAssignmentId) {
      setError("Please select an assignment.");
      return;
    }

    if (!note.trim()) {
      setError("Submission note is required.");
      return;
    }

    try {
      setSubmitting(true);

      await createSubmission(
        selectedAssignmentId,
        studentId,
        note.trim(),
        file
      );

      setSuccess("Assignment submitted successfully.");

      setNote("");
      setFile(null);
      setSelectedAssignmentId("");

      await loadData();
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to submit assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------
  // Helpers
  // ----------------------------
  const getNoteFromSubmission = (submission) => {
    return submission?.note || "";
  };

  const getCourseName = (courseOfferingId) => {
    const matchingEnrollment = enrollments.find(
      (enrollment) =>
        Number(enrollment.courseOfferingId) ===
        Number(courseOfferingId)
    );

    const course =
      matchingEnrollment?.courseOffering?.course;

    if (!course) return "Course";

    return `${course.code || ""} — ${course.name || ""}`;
  };

  const getSubmission = (assignmentId) => {
    return submissions.find(
      (submission) =>
        Number(submission.assignmentId) ===
        Number(assignmentId)
    );
  };

  const handleAssignmentChange = (event) => {
    const value = event.target.value;

    setSelectedAssignmentId(value);

    const submission = value
      ? getSubmission(value)
      : null;

    setNote(
      submission
        ? getNoteFromSubmission(submission)
        : ""
    );

    setFile(null);
  };

  const isOverdue = (assignment) => {
    return (
      assignment.deadline &&
      new Date(assignment.deadline).getTime() < now
    );
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const submittedCount = allAssignments.filter(
    (assignment) => getSubmission(assignment.id)
  ).length;

  const selectedSubmission = selectedAssignmentId
    ? getSubmission(selectedAssignmentId)
    : null;

  const isResubmitting =
    selectedSubmission &&
    (selectedSubmission.marks === null ||
      selectedSubmission.marks === undefined);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="bg-white border-b border-slate-200 px-8 py-5">
          <p className="text-sm text-slate-500">Student Portal</p>

          <h2 className="text-2xl font-bold text-slate-800">
            Assignments
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            View and submit your course assignments.
          </p>
        </header>

        <div className="p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
              Loading assignments...
            </div>
          ) : (
            <>
              {allAssignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                  <div className="text-4xl mb-3">📝</div>

                  <h3 className="text-lg font-semibold text-slate-700">
                    No Assignments
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    No assignments have been published for
                    your courses yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <p className="text-sm text-slate-500">
                        Total Assignments
                      </p>

                      <p className="text-3xl font-bold text-slate-800 mt-2">
                        {allAssignments.length}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <p className="text-sm text-slate-500">
                        Submitted
                      </p>

                      <p className="text-3xl font-bold text-green-600 mt-2">
                        {submittedCount}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <p className="text-sm text-slate-500">
                        Pending
                      </p>

                      <p className="text-3xl font-bold text-orange-600 mt-2">
                        {allAssignments.length -
                          submittedCount}
                      </p>
                    </div>
                  </div>

                  {/* Submit Form */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Submit Assignment
                    </h3>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Assignment
                        </label>

                        <select
                          value={selectedAssignmentId}
                          onChange={handleAssignmentChange}
                          className="w-full md:w-1/2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {assignments.map((assignment) => {
                            const submission = getSubmission(
                              assignment.id
                            );

                            const graded =
                              submission &&
                              submission.marks !== null;

                            return (
                              <option
                                key={
                                  assignment.id ||
                                  "placeholder"
                                }
                                value={
                                  assignment.id || ""
                                }
                                disabled={
                                  !assignment.id ||
                                  isOverdue(assignment) ||
                                  graded
                                }
                              >
                                {assignment.id
                                  ? `${getCourseName(
                                      assignment.courseOfferingId
                                    )} — ${
                                      assignment.title
                                    }${
                                      submission
                                        ? " (submitted)"
                                        : isOverdue(assignment)
                                          ? " (overdue)"
                                          : ""
                                    }`
                                  : assignment.title}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Submission Note
                        </label>

                        {isResubmitting && (
                          <p className="mb-2 text-sm text-amber-600">
                            You have already submitted this
                            assignment. You can resubmit before
                            the deadline.
                          </p>
                        )}

                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows="3"
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          placeholder="Add a note for your submission"
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Attachment (Optional)
                        </label>

                        <input
                          type="file"
                          onChange={(e) => {
                            const selectedFile =
                              e.target.files?.[0] ||
                              null;

                            setFile(selectedFile);
                          }}
                          className="w-full md:w-1/2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600"
                        />

                        {file && (
                          <p className="mt-2 text-sm text-slate-600">
                            Selected file: {file.name}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || !studentId}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting
                          ? "Submitting..."
                          : isResubmitting
                            ? "Resubmit Assignment"
                            : "Submit Assignment"}
                      </button>
                    </form>
                  </div>

                  {/* Assignments List */}
                  <div className="space-y-4">
                    {allAssignments.map((assignment) => {
                      const submission = getSubmission(
                        assignment.id
                      );

                      return (
                        <div
                          key={assignment.id}
                          className="bg-white rounded-xl border border-slate-200 p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                {getCourseName(
                                  assignment.courseOfferingId
                                )}
                              </p>

                              <h4 className="text-lg font-semibold text-slate-800 mt-1">
                                {assignment.title}
                              </h4>

                              <p className="text-sm text-slate-600 mt-1">
                                {assignment.description ||
                                  "No description provided."}
                              </p>

                              <p className="text-xs text-slate-400 mt-2">
                                Deadline:{" "}
                                <span
                                  className={
                                    isOverdue(assignment)
                                      ? "text-red-600 font-medium"
                                      : ""
                                  }
                                >
                                  {formatDate(
                                    assignment.deadline
                                  )}
                                </span>
                              </p>

                              {assignment.attachmentName && (
                                <p className="text-xs text-slate-500 mt-3">
                                  Attachment:{" "}
                                  {assignment.attachmentName}
                                </p>
                              )}

                              {assignment.attachmentName && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    downloadAssignmentAttachment(
                                      assignment.id
                                    )
                                  }
                                  className="mt-1 inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                >
                                  Download
                                </button>
                              )}
                            </div>

                            <div className="ml-6 text-right">
                              {submission ? (
                                <>
                                  <button
                                    type="button"
                                    disabled
                                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium"
                                  >
                                    Submitted
                                  </button>

                                  {getNoteFromSubmission(
                                    submission
                                  ) && (
                                    <p className="text-xs text-slate-500 mt-2 max-w-xs break-words text-left">
                                      {getNoteFromSubmission(
                                        submission
                                      )}
                                    </p>
                                  )}

                                  {submission.fileName && (
                                    <p className="text-xs text-slate-500 mt-2 max-w-xs break-words text-left">
                                      File: {submission.fileName}
                                    </p>
                                  )}

                                  {submission.fileName && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        downloadSubmissionFile(
                                          submission.id
                                        )
                                      }
                                      className="mt-1 inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                                    >
                                      Download
                                    </button>
                                  )}

                                  <p className="text-xs text-slate-400 mt-1">
                                    {submission.marks === null
                                      ? `Submitted on ${formatDate(
                                          submission.submittedAt
                                        )}`
                                      : ""}
                                  </p>

                                  {submission.marks !== null &&
                                    submission.marks !==
                                      undefined && (
                                      <p className="text-sm font-semibold text-slate-700 mt-2">
                                        Marks: {submission.marks}
                                      </p>
                                    )}

                                  {submission.feedback && (
                                    <p className="text-xs text-slate-500 mt-1 max-w-xs text-left">
                                      Feedback:{" "}
                                      {submission.feedback}
                                    </p>
                                  )}
                                </>
                              ) : isOverdue(assignment) ? (
                                <button
                                  type="button"
                                  disabled
                                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium"
                                >
                                  Overdue
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium"
                                >
                                  Pending
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Assignments;