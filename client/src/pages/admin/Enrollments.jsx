import { useState } from "react";

import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../../services/enrollmentApi";

import { getStudents } from "../../services/studentApi";
import { getCourseOfferings } from "../../services/courseOfferingApi";

import api from "../../services/axios";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [sections, setSections] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [courseOfferingId, setCourseOfferingId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------
  // Load All Data
  // ----------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        enrollmentData,
        studentData,
        offeringData,
      ] = await Promise.all([
        getEnrollments(),
        getStudents(),
        getCourseOfferings(),
      ]);

      setEnrollments(enrollmentData);
      setStudents(studentData);
      setCourseOfferings(offeringData);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load enrollments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Load Initial Data
  // ----------------------------
  if (
    enrollments.length === 0 &&
    students.length === 0 &&
    courseOfferings.length === 0 &&
    !loading &&
    !error
  ) {
    fetchData();
  }

  // ----------------------------
  // Load Sections
  // ----------------------------
  const loadSections = async (offeringId) => {
    if (!offeringId) {
      setSections([]);
      setSectionId("");
      return;
    }

    try {
      const response = await api.get("/sections");

      const filteredSections = response.data.filter(
        (section) =>
          Number(section.courseOfferingId) ===
          Number(offeringId)
      );

      setSections(filteredSections);
    } catch (error) {
      console.error(error);

      setSections([]);
      setSectionId("");
    }
  };

  // ----------------------------
  // Course Offering Change
  // ----------------------------
  const handleCourseOfferingChange = async (e) => {
    const value = e.target.value;

    setCourseOfferingId(value);
    setSectionId("");

    await loadSections(value);
  };

  // ----------------------------
  // Reset Form
  // ----------------------------
  const resetForm = () => {
    setStudentId("");
    setCourseOfferingId("");
    setSectionId("");
    setEditingId(null);
    setShowForm(false);
    setSections([]);
    setError("");
  };

  // ----------------------------
  // Validate Form
  // ----------------------------
  const validateForm = () => {
    if (!studentId) {
      setError("Please select a student.");
      return false;
    }

    if (!courseOfferingId) {
      setError("Please select a course offering.");
      return false;
    }

    return true;
  };

  // ----------------------------
  // Create / Update
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateEnrollment(
          editingId,
          studentId,
          courseOfferingId,
          sectionId || null
        );

        setSuccess(
          "Enrollment updated successfully."
        );
      } else {
        await createEnrollment(
          studentId,
          courseOfferingId,
          sectionId || null
        );

        setSuccess(
          "Enrollment created successfully."
        );
      }

      setStudentId("");
      setCourseOfferingId("");
      setSectionId("");
      setEditingId(null);
      setShowForm(false);
      setSections([]);

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save enrollment."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Edit
  // ----------------------------
  const handleEdit = async (enrollment) => {
    setError("");
    setSuccess("");

    setEditingId(enrollment.id);
    setStudentId(String(enrollment.studentId));
    setCourseOfferingId(
      String(enrollment.courseOfferingId)
    );

    setShowForm(true);

    await loadSections(enrollment.courseOfferingId);

    setSectionId(
      enrollment.sectionId
        ? String(enrollment.sectionId)
        : ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------
  // Delete
  // ----------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteEnrollment(id);

      setSuccess(
        "Enrollment deleted successfully."
      );

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete enrollment."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Enrollment Management
        </h1>

        <p className="mt-2 text-gray-500">
          Manage student enrollments for course offerings
          and sections.
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-xl bg-white shadow">

        {/* Card Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Enrollment List
            </h2>

            <p className="text-sm text-gray-500">
              Total Enrollments: {enrollments.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setError("");
                setSuccess("");
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            {showForm
              ? "Cancel"
              : "+ Add Enrollment"}
          </button>

        </div>

        {/* Form */}
        {showForm && (
          <div className="border-b bg-gray-50 p-6">

            <h3 className="mb-5 text-lg font-semibold text-gray-800">
              {editingId
                ? "Edit Enrollment"
                : "Create Enrollment"}
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* Student */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Student
                  </label>

                  <select
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">
                      Select Student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student.id}
                        value={student.id}
                      >
                        {student.studentId} —{" "}
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Offering */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Offering
                  </label>

                  <select
                    value={courseOfferingId}
                    onChange={
                      handleCourseOfferingChange
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">
                      Select Course Offering
                    </option>

                    {courseOfferings.map(
                      (offering) => (
                        <option
                          key={offering.id}
                          value={offering.id}
                        >
                          {offering.course?.code} —{" "}
                          {offering.course?.name} (
                          {
                            offering
                              .academicSemester?.name
                          }
                          )
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Section
                    <span className="ml-1 text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <select
                    value={sectionId}
                    onChange={(e) =>
                      setSectionId(e.target.value)
                    }
                    disabled={!courseOfferingId}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">
                      {courseOfferingId
                        ? "No Section"
                        : "Select Course Offering First"}
                    </option>

                    {sections.map((section) => (
                      <option
                        key={section.id}
                        value={section.id}
                      >
                        {section.name}
                        {section.room
                          ? ` (${section.room})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                    ? "Update Enrollment"
                    : "Create Enrollment"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg bg-gray-500 px-6 py-2.5 font-medium text-white hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading enrollments...
            </div>
          ) : enrollments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No enrollments found.
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-gray-50 text-left">
                <tr className="border-b">

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Student
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Student ID
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Course
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Semester
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Section
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {enrollments.map(
                  (enrollment, index) => (
                    <tr
                      key={enrollment.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {enrollment.student?.name ||
                            "Unknown Student"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {enrollment.student?.email ||
                            "No email"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {enrollment.student
                          ?.studentId || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {enrollment.courseOffering
                            ?.course?.code || "N/A"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {enrollment.courseOffering
                            ?.course?.name || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {enrollment.courseOffering
                          ?.academicSemester?.name ||
                          "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {enrollment.section?.name ||
                          "Not Assigned"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(enrollment)
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                enrollment.id
                              )
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>
      </div>
    </div>
  );
};

export default Enrollments;