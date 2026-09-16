import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getStudentByUserId } from "../../services/studentApi";
import { getEnrollmentsByStudentId } from "../../services/enrollmentApi";
import { getAllCourseResults } from "../../services/courseResultApi";

function Results() {
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!storedUser) {
          setError("User information not found.");
          return;
        }

        const currentStudent = await getStudentByUserId(
          storedUser.id
        );

        if (!currentStudent) {
          setError("Student information not found.");
          return;
        }

        setStudent(currentStudent);

        const enrollmentsRes =
          await getEnrollmentsByStudentId(
            currentStudent.id
          );

        const studentEnrollments =
          Array.isArray(enrollmentsRes)
            ? enrollmentsRes
            : enrollmentsRes?.data || [];

        setEnrollments(studentEnrollments);

        const resultsResponse =
          await getAllCourseResults();

        const allResults = Array.isArray(
          resultsResponse
        )
          ? resultsResponse
          : resultsResponse?.data || [];

        const enrollmentIds =
          studentEnrollments.map(
            (enrollment) =>
              Number(enrollment.id)
          );

        const studentResults = allResults.filter(
          (result) =>
            enrollmentIds.includes(
              Number(result.enrollmentId)
            )
        );

        setResults(studentResults);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load results."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Format grade (A_PLUS -> A+)
  const formatGrade = (grade) => {
    if (!grade) return "-";

    return grade
      .replace(/_/g, "")
      .replace("PLUS", "+");
  };

  // Find result for an enrollment
  const getResultForEnrollment = (enrollmentId) => {
    return results.find(
      (result) =>
        Number(result.enrollmentId) ===
        Number(enrollmentId)
    );
  };

  // Build course rows with their result
  const rows = enrollments.map((enrollment) => {
    const course =
      enrollment.courseOffering?.course;
    const semester =
      enrollment.courseOffering?.academicSemester;
    const result =
      getResultForEnrollment(enrollment.id);

    return {
      enrollment,
      course,
      semester,
      credit: Number(course?.credit || 0),
      result,
      totalMarks:
        result?.totalMarks !== undefined &&
        result?.totalMarks !== null
          ? Number(result.totalMarks)
          : null,
      gradePoint:
        result?.gradePoint !== undefined &&
        result?.gradePoint !== null
          ? Number(result.gradePoint)
          : null,
    };
  });

  // Rows with a published result
  const gradedRows = rows.filter(
    (row) => row.result != null
  );

  // Group results by semester name
  const semesterGroups = [];

  rows.forEach((row) => {
    const name =
      row.semester?.name || "Unknown Semester";

    let group = semesterGroups.find(
      (g) => g.name === name
    );

    if (!group) {
      group = { name, rows: [] };
      semesterGroups.push(group);
    }

    group.rows.push(row);
  });

  // Compute GPA for a set of graded rows
  const computeGPA = (graded) => {
    if (graded.length === 0) return 0;

    const totalCredits = graded.reduce(
      (sum, row) => sum + row.credit,
      0
    );

    if (totalCredits === 0) return 0;

    const totalPoints = graded.reduce(
      (sum, row) =>
        sum +
        row.credit * (row.gradePoint || 0),
      0
    );

    return Number(
      (totalPoints / totalCredits).toFixed(2)
    );
  };

  // Overall CGPA across all graded rows
  const cgpa = computeGPA(gradedRows);

  return (
    <>
      <header className="bg-white/[0.03] border-b border-white/10 px-8 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Student Portal
            </p>

            <h2 className="text-2xl font-bold text-slate-100">
              Results
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View your semester results, GPA and CGPA.
            </p>

            <Link
              to="/student/transcript"
              className="inline-block mt-3 text-blue-400 text-sm font-medium hover:underline"
            >
              View Full Transcript →
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">
                {student?.name || "Student"}
              </p>

              <p className="text-xs text-slate-500">
                {student?.studentId || ""}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-semibold">
              {student?.name
                ? student.name
                    .charAt(0)
                    .toUpperCase()
                : "S"}
            </div>
          </div>
        </header>

        <div className="p-8">
          {loading && (
            <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center">
              <p className="text-slate-500">
                Loading your results...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white/[0.03] rounded-xl border border-red-500/20 p-6">
              <p className="text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Student Info */}
              <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Student
                    </p>

                    <h3 className="text-xl font-bold text-slate-100 mt-1">
                      {student?.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Student ID:{" "}
                      {student?.studentId}
                    </p>

                    {student?.program && (
                      <p className="text-sm text-slate-500">
                        Program:{" "}
                        {student.program.name}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">
                      Current CGPA
                    </p>

                    <p className="text-3xl font-bold text-slate-100">
                      {gradedRows.length > 0
                        ? cgpa
                        : "-"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Based on {gradedRows.length} graded
                      course(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/[0.03] rounded-xl shadow-sm p-6">
                  <p className="text-sm text-slate-400">
                    Enrolled Courses
                  </p>

                  <p className="text-2xl font-bold text-slate-100 mt-2">
                    {rows.length}
                  </p>
                </div>

                <div className="bg-white/[0.03] rounded-xl shadow-sm p-6">
                  <p className="text-sm text-slate-400">
                    Completed Courses
                  </p>

                  <p className="text-2xl font-bold text-emerald-400 mt-2">
                    {gradedRows.length}
                  </p>
                </div>

                <div className="bg-white/[0.03] rounded-xl shadow-sm p-6">
                  <p className="text-sm text-slate-400">
                    Total Credits
                  </p>

                  <p className="text-2xl font-bold text-indigo-400 mt-2">
                    {rows.reduce(
                      (sum, row) => sum + row.credit,
                      0
                    )}
                  </p>
                </div>
              </div>

              {/* Per Semester Results */}
              {semesterGroups.map((group) => {
                const graded = group.rows.filter(
                  (row) => row.result != null
                );

                const gpa = computeGPA(graded);

                return (
                  <div
                    key={group.name}
                    className="bg-white/[0.03] rounded-xl border border-white/10 mb-8 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">
                          {group.name}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {group.rows.length} course(s)
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          Semester GPA
                        </p>

                        <p className="text-2xl font-bold text-slate-100">
                          {graded.length > 0
                            ? gpa
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Course
                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Code
                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Credit
                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Total Marks
                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Grade
                            </th>

                            <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                              Grade Point
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-white/10">
                          {group.rows.map((row) => (
                            <tr
                              key={row.enrollment.id}
                              className="hover:bg-white/5"
                            >
                              <td className="px-6 py-4 font-medium text-slate-100">
                                {row.course?.name ||
                                  "Unknown Course"}
                              </td>

                              <td className="px-6 py-4 text-slate-300">
                                {row.course?.code || "-"}
                              </td>

                              <td className="px-6 py-4 text-slate-300">
                                {row.credit || "-"}
                              </td>

                              <td className="px-6 py-4 text-slate-200">
                                {row.totalMarks !== null
                                  ? row.totalMarks
                                  : "-"}
                              </td>

                              <td className="px-6 py-4">
                                {row.result ? (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300">
                                    {formatGrade(
                                      row.result.grade
                                    )}
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400">
                                    Not Graded
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-4 text-slate-200">
                                {row.gradePoint !== null
                                  ? row.gradePoint
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Empty state */}
              {rows.length === 0 && (
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center">
                  <div className="text-4xl mb-3">
                    🎓
                  </div>

                  <h3 className="text-lg font-semibold text-slate-200">
                    No Results Found
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    You are not enrolled in any courses
                    yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
    </>
  );
}

export default Results;