import { useEffect, useState } from "react";

import { getStudentByUserId } from "../../services/studentApi";
import { getAcademicSemesters } from "../../services/academicSemesterApi";
import { getCourseOfferings } from "../../services/courseOfferingApi";

import {
  getRegistrationsByStudent,
  createCourseRegistration,
  deleteCourseRegistration,
} from "../../services/courseRegistrationApi";

function CourseRegistration() {
  const [student, setStudent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [selectedSemesterId, setSelectedSemesterId] =
    useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState(
    []
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ----------------------------
  // Load all reference data
  // ----------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Student profile
      const currentStudent = await getStudentByUserId(
        user?.id
      );

      if (!currentStudent) {
        setError("Student information not found.");
        return;
      }

      setStudent(currentStudent);

      // Semesters for the student's program
      const semesterResponse =
        await getAcademicSemesters();
      let semesterData =
        semesterResponse?.data ||
        semesterResponse ||
        [];

      if (!Array.isArray(semesterData)) semesterData = [];

      const programSemesters = semesterData.filter(
        (semester) =>
          Number(semester.programId) ===
          Number(currentStudent.programId)
      );

      setSemesters(programSemesters);

      // Course offerings
      const offeringResponse =
        await getCourseOfferings();
      let offeringData =
        offeringResponse?.data || offeringResponse || [];

      if (!Array.isArray(offeringData)) offeringData = [];

      setCourseOfferings(offeringData);

      // Existing registrations
      const registrationResponse =
        await getRegistrationsByStudent(currentStudent.id);
      let registrationData =
        registrationResponse?.data ||
        registrationResponse ||
        [];

      if (!Array.isArray(registrationData))
        registrationData = [];

      setRegistrations(registrationData);
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to load course registration data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  }, []);

  // ----------------------------
  // Helpers
  // ----------------------------
  const getSemesterOfferings = () => {
    return courseOfferings.filter(
      (offering) =>
        Number(offering.academicSemesterId) ===
        Number(selectedSemesterId)
    );
  };

  const getRegistration = () => {
    return registrations.find(
      (registration) =>
        Number(registration.academicSemesterId) ===
        Number(selectedSemesterId)
    );
  };

  const getSelectedSemester = () => {
    return semesters.find(
      (semester) =>
        Number(semester.id) === Number(selectedSemesterId)
    );
  };

  // ----------------------------
  // Toggle course checkbox
  // ----------------------------
  const toggleCourse = (offeringId) => {
    setSelectedCourseIds((previous) =>
      previous.includes(offeringId)
        ? previous.filter((id) => id !== offeringId)
        : [...previous, offeringId]
    );

    setSuccess("");
    setError("");
  };

  // ----------------------------
  // Submit registration
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedSemesterId) {
      setError("Please select a semester.");
      return;
    }

    if (selectedCourseIds.length === 0) {
      setError(
        "Please select at least one course to register."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await createCourseRegistration(
        student.id,
        selectedSemesterId,
        selectedCourseIds
      );

      setSuccess(
        response?.data?.message ||
          "Course registration submitted successfully."
      );

      setSelectedCourseIds([]);

      await loadData();
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to submit course registration."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------
  // Cancel / delete registration
  // ----------------------------
  const handleDeleteRegistration = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this course registration?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteCourseRegistration(id);

      setSuccess("Course registration cancelled.");

      await loadData();
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to cancel course registration."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/15 text-emerald-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-500/15 text-red-300";
      case "CANCELLED":
        return "bg-white/5 text-slate-300";
      default:
        return "bg-white/5 text-slate-200";
    }
  };

  const semesterOfferings = getSemesterOfferings();
  const activeRegistration = getRegistration();

  return (
    <>
      <header className="bg-white/[0.03] border-b border-white/10 px-8 py-5">
          <p className="text-sm text-slate-500">Student Portal</p>

          <h2 className="text-2xl font-bold text-slate-100">
            Course Registration
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Register for courses in your upcoming semester.
          </p>
        </header>

        <div className="p-8">
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center text-slate-500">
              Loading course registration...
            </div>
          ) : (
            <>
              {semesters.length === 0 ? (
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center">
                  <div className="text-4xl mb-3">📚</div>

                  <h3 className="text-lg font-semibold text-slate-200">
                    No Semesters Found
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    No academic semesters are available for
                    your program yet.
                  </p>
                </div>
              ) : (
                <>
                  {/* Semester Selector */}
                  <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6 mb-6">
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                      Select Semester
                    </label>

                    <select
                      value={selectedSemesterId}
                      onChange={(e) => {
                        setSelectedSemesterId(e.target.value);
                        setSelectedCourseIds([]);
                        setSuccess("");
                        setError("");
                      }}
                      className="w-full md:w-1/2 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">
                        Select a semester
                      </option>

                      {semesters.map((semester) => {
                        const registration = registrations.find(
                          (registration) =>
                            Number(
                              registration.academicSemesterId
                            ) === Number(semester.id)
                        );

                        return (
                          <option
                            key={semester.id}
                            value={semester.id}
                          >
                            {semester.name}
                            {registration
                              ? ` (${registration.status})`
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedSemesterId && (
                    <>
                      {/* Registration status */}
                      {activeRegistration ? (
                        <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-100">
                                Registration Status
                              </h3>

                              <p className="text-sm text-slate-500 mt-1">
                                Submitted on{" "}
                                {activeRegistration.createdAt
                                  ? new Date(
                                      activeRegistration.createdAt
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>

                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusClass(
                                activeRegistration.status
                              )}`}
                            >
                              {activeRegistration.status}
                            </span>
                          </div>

                          <div className="mt-6">
                            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
                              Registered Courses
                            </h4>

                            {activeRegistration.items?.length ===
                            0 ? (
                              <p className="text-sm text-slate-500">
                                No courses attached.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {activeRegistration.items?.map(
                                  (item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white/5"
                                    >
                                      <div>
                                        <p className="font-medium text-slate-100">
                                          {item.courseOffering
                                            ?.course?.code ||
                                            "—"}{" "}
                                          —{" "}
                                          {item.courseOffering
                                            ?.course?.name ||
                                            "Unknown course"}
                                        </p>

                                        <p className="text-xs text-slate-500 mt-0.5">
                                          Credit hours:{" "}
                                          {item.courseOffering
                                            ?.course?.creditHours ??
                                            "N/A"}
                                        </p>
                                      </div>

                                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">
                                        Registered
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {activeRegistration.status !==
                            "APPROVED" && (
                            <div className="mt-6 pt-5 border-t flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteRegistration(
                                    activeRegistration.id
                                  )
                                }
                                className="px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                              >
                                Cancel Registration
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Register form */}
                          <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6 mb-6">
                            <h3 className="text-lg font-semibold text-slate-100">
                              Available Courses
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Select the courses you want to
                              register for{" "}
                              {getSelectedSemester()?.name}.
                            </p>

                            {semesterOfferings.length === 0 ? (
                              <p className="text-sm text-slate-500 mt-6">
                                No course offerings exist for
                                this semester yet.
                              </p>
                            ) : (
                              <form
                                onSubmit={handleSubmit}
                                className="mt-6"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {semesterOfferings.map(
                                    (offering) => (
                                      <label
                                        key={offering.id}
                                        className={`flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                                          selectedCourseIds.includes(
                                            offering.id
                                          )
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-white/10 hover:border-white/15"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedCourseIds.includes(
                                            offering.id
                                          )}
                                          onChange={() =>
                                            toggleCourse(
                                              offering.id
                                            )
                                          }
                                          className="mt-1 h-4 w-4 accent-blue-600"
                                        />

                                        <div>
                                          <p className="font-medium text-slate-100">
                                            {offering.course
                                              ?.code || "—"}{" "}
                                            —{" "}
                                            {offering.course
                                              ?.name ||
                                              "Unknown course"}
                                          </p>

                                          <p className="text-xs text-slate-500 mt-1">
                                            Credit hours:{" "}
                                            {offering.course
                                              ?.creditHours ??
                                              "N/A"}{" "}
                                            •{" "}
                                            {offering
                                              .academicSemester
                                              ?.name ||
                                              "Semester"}
                                          </p>
                                        </div>
                                      </label>
                                    )
                                  )}
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                  <p className="text-sm text-slate-500">
                                    Selected:{" "}
                                    <span className="font-semibold text-slate-200">
                                      {selectedCourseIds.length}
                                    </span>{" "}
                                    course(s)
                                  </p>

                                  <button
                                    type="submit"
                                    disabled={
                                      submitting ||
                                      selectedCourseIds.length ===
                                        0
                                    }
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    {submitting
                                      ? "Submitting..."
                                      : "Submit Registration"}
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Registration history */}
                  {registrations.length > 0 && (
                    <div className="bg-white/[0.03] rounded-xl border border-white/10 overflow-hidden">
                      <div className="border-b px-6 py-5">
                        <h3 className="text-lg font-semibold text-slate-100">
                          Registration History
                        </h3>

                        <p className="text-sm text-slate-500">
                          All your semester registrations
                        </p>
                      </div>

                      <table className="w-full">
                        <thead className="bg-white/5 text-left">
                          <tr className="border-b">
                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                              Semester
                            </th>

                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                              Courses
                            </th>

                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                              Status
                            </th>

                            <th className="px-5 py-3 text-sm font-semibold text-slate-200">
                              Submitted
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-white/10">
                          {registrations.map((registration) => (
                            <tr
                              key={registration.id}
                              className="hover:bg-white/5"
                            >
                              <td className="px-5 py-4 text-sm font-medium text-slate-100">
                                {registration.academicSemester
                                  ?.name || "N/A"}
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-300">
                                {registration.items?.length || 0}{" "}
                                course(s)
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                    registration.status
                                  )}`}
                                >
                                  {registration.status}
                                </span>
                              </td>

                              <td className="px-5 py-4 text-sm text-slate-300">
                                {registration.createdAt
                                  ? new Date(
                                      registration.createdAt
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
    </>
  );
}

export default CourseRegistration;