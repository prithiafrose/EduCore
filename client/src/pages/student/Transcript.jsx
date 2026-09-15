import { useEffect, useState } from "react";

import { getStudentByUserId } from "../../services/studentApi";
import { getStudentTranscript } from "../../services/courseResultApi";

function Transcript() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [student, setStudent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [completedCredits, setCompletedCredits] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTranscript = async () => {
      try {
        setLoading(true);
        setError("");

        const currentStudent = await getStudentByUserId(
          user?.id
        );

        if (!currentStudent) {
          setError("Student information not found.");
          return;
        }

        setStudent(currentStudent);

        const transcriptResponse =
          await getStudentTranscript(currentStudent.id);

        const transcript =
          transcriptResponse?.data || transcriptResponse || {};

        setSemesters(
          Array.isArray(transcript.semesters)
            ? transcript.semesters
            : []
        );

        setCgpa(
          transcript.cgpa !== undefined &&
            transcript.cgpa !== null
            ? transcript.cgpa
            : null
        );

        setCompletedCredits(
          transcript.completedCredits !== undefined &&
            transcript.completedCredits !== null
            ? transcript.completedCredits
            : null
        );
      } catch (error) {
        console.error(
          "Failed to load transcript:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load transcript."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTranscript();
  }, []);

  return (
        <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Academic Transcript
          </h1>

          <p className="text-slate-500 mt-2">
            Your complete academic record across all semesters
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-400">
              Loading transcript...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
            <p className="text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Student Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
                    {student?.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {student?.name}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {student?.studentId || ""}

                      {student?.program?.name &&
                        ` • ${student.program.name}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-10">
                  <div>
                    <p className="text-sm text-slate-500">
                      CGPA
                    </p>

                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {cgpa !== null ? cgpa : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Completed Credits
                    </p>

                    <p className="text-3xl font-bold text-indigo-600 mt-1">
                      {completedCredits ?? "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Semester Transcripts */}
            {semesters.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
                <p className="text-slate-400 text-sm">
                  No course results have been published yet.
                </p>
              </div>
            ) : (
              semesters.map((group) => (
                <div
                  key={
                    group.semester?.id ||
                    group.semester?.name ||
                    "semester"
                  }
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Academic Transcript
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {group.semester?.name}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Code
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Course
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Credit
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Total Marks
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Grade
                          </th>

                          <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                            Grade Point
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {group.courses.map((courseRow) => {
                          const hasMarks =
                            courseRow.totalMarks !== null &&
                            courseRow.totalMarks !== undefined;

                          return (
                            <tr
                              key={courseRow.enrollmentId}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {courseRow.course?.code ||
                                  "-"}
                              </td>

                              <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                {courseRow.course?.name ||
                                  "Unknown Course"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-600">
                                {courseRow.course?.credit ??
                                  "-"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                {hasMarks
                                  ? courseRow.totalMarks
                                  : "—"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                {hasMarks &&
                                courseRow.grade
                                  ? courseRow.grade
                                  : "—"}
                              </td>

                              <td className="px-6 py-4 text-sm text-slate-700">
                                {hasMarks &&
                                courseRow.gradePoint !==
                                  null &&
                                courseRow.gradePoint !==
                                  undefined
                                  ? courseRow.gradePoint
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </>
        )}
        </>
  );
}

export default Transcript;