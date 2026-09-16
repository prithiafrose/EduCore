import { useEffect, useState } from "react";

import { getAllCourseResults, generateCourseResult } from "../../services/courseResultApi";

import { getEnrollments } from "../../services/enrollmentApi";

const Results = () => {
  const [results, setResults] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const [selectedEnrollmentId, setSelectedEnrollmentId] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------
  // Load All Data
  // ----------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resultResponse, enrollmentResponse] =
        await Promise.all([
          getAllCourseResults(),
          getEnrollments(),
        ]);

      const resultsList = Array.isArray(
        resultResponse
      )
        ? resultResponse
        : resultResponse?.data || [];

      const enrollmentsList = Array.isArray(
        enrollmentResponse
      )
        ? enrollmentResponse
        : enrollmentResponse?.data || [];

      setResults(resultsList);
      setEnrollments(enrollmentsList);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load results."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Load Initial Data
  // ----------------------------
  useEffect(() => {
    fetchData();
  }, []);

  // ----------------------------
  // Generate Result
  // ----------------------------
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!selectedEnrollmentId) {
      setError("Please select an enrollment.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      await generateCourseResult(selectedEnrollmentId);

      setSuccess(
        "Course result generated successfully."
      );

      setSelectedEnrollmentId("");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to generate result."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ----------------------------
  // Find enrollment by result
  // ----------------------------
  const getEnrollmentForResult = (result) => {
    return enrollments.find(
      (enrollment) =>
        Number(enrollment.id) ===
        Number(result.enrollmentId)
    );
  };

  // ----------------------------
  // Enrollments without results
  // ----------------------------
  const resultEnrollmentIds = new Set(
    results.map((result) => Number(result.enrollmentId))
  );

  const pendingEnrollments = enrollments.filter(
    (enrollment) =>
      !resultEnrollmentIds.has(Number(enrollment.id))
  );

  // ----------------------------
  // Format grade
  // ----------------------------
  const formatGrade = (grade) => {
    if (!grade) return "-";

    return grade
      .replace(/_/g, "")
      .replace("PLUS", "+");
  };

  // Grade count statistics
  const gradeCounts = {};

  results.forEach((result) => {
    const grade =
      result.grade || "N/A";

    gradeCounts[grade] =
      (gradeCounts[grade] || 0) + 1;
  });

  const gradeStatKeys = Object.keys(gradeCounts);

  return (
      <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Results Management
          </h1>

          <p className="mt-2 text-slate-400">
            Generate and view course results for all
            students.
          </p>
        </div>

        </div>

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/[0.03] p-6 rounded-2xl shadow-sm border border-white/10">
          <p className="text-sm text-slate-400">
            Published Results
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {results.length}
          </h3>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl shadow-sm border border-white/10">
          <p className="text-sm text-slate-400">
            Total Enrollments
          </p>

          <h3 className="text-3xl font-bold text-white mt-2">
            {enrollments.length}
          </h3>
        </div>

        <div className="bg-white/[0.03] p-6 rounded-2xl shadow-sm border border-white/10">
          <p className="text-sm text-slate-400">
            Pending Results
          </p>

          <h3 className="text-3xl font-bold text-orange-600 mt-2">
            {pendingEnrollments.length}
          </h3>
        </div>
      </div>

      {/* Generate Form Card */}
      <div className="rounded-xl bg-white/[0.03] shadow mb-8">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-100">
            Generate Result
          </h2>

          <p className="text-sm text-slate-400">
            Select an enrollment to calculate its final
            grade.
          </p>
        </div>

        <div className="p-6">
          <form
            onSubmit={handleGenerate}
            className="flex flex-col md:flex-row items-start md:items-end gap-4"
          >
            <div className="flex-1 w-full">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Enrollment
              </label>

              <select
                value={selectedEnrollmentId}
                onChange={(e) =>
                  setSelectedEnrollmentId(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">
                  Select an enrollment
                </option>

                {enrollments.map((enrollment) => (
                  <option
                    key={enrollment.id}
                    value={enrollment.id}
                  >
                    {enrollment.student?.name} —{" "}
                    {enrollment.courseOffering?.course
                      ?.code}{" "}
                    (
                    {
                      enrollment.courseOffering
                        ?.academicSemester?.name
                    }
                    )
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating..."
                : "Generate Result"}
            </button>
          </form>
        </div>
      </div>

      {/* Grade Statistics */}
      {gradeStatKeys.length > 0 && (
        <div className="rounded-xl bg-white/[0.03] shadow mb-8">
          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-100">
              Grade Summary
            </h2>

            <p className="text-sm text-slate-400">
              Distribution of grades across published
              results.
            </p>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {gradeStatKeys.map((grade) => (
                <div
                  key={grade}
                  className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-3"
                >
                  <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold">
                    {formatGrade(grade)}
                  </span>

                  <span className="text-xl font-bold text-slate-100">
                    {gradeCounts[grade]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="rounded-xl bg-white/[0.03] shadow">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-100">
            Published Results
          </h2>

          <p className="text-sm text-slate-400">
            Total Results: {results.length}
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading results...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No results published yet. Generate results
              to see them here.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/5 text-left">
                <tr className="border-b">
                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Student
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Course
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Semester
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Assessment (/40)
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Exam (/60)
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Total
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Grade
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                    Point
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {results.map((result, index) => {
                  const enrollment =
                    getEnrollmentForResult(result);

                  return (
                    <tr
                      key={result.id}
                      className="hover:bg-white/5"
                    >
                      <td className="px-5 py-4 text-sm text-slate-300">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-100">
                          {enrollment?.student?.name ||
                            "Unknown Student"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {enrollment?.student?.studentId ||
                            "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-100">
                          {enrollment?.courseOffering
                            ?.course?.code || "N/A"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {enrollment?.courseOffering
                            ?.course?.name || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {enrollment?.courseOffering
                          ?.academicSemester?.name ||
                          "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {result.assessmentResult}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {result.examResult}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-100">
                        {result.totalMarks}
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold">
                          {formatGrade(result.grade)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-200">
                        {result.gradePoint}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
  );
};

export default Results;