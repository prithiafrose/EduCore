
import { useState } from "react";

import {
  createAssessment,
  getAssessmentsByCourseOffering,
} from "../../services/assessmentApi";

import { getCourseOfferings } from "../../services/courseOfferingApi";

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);

  const [courseOfferingId, setCourseOfferingId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ----------------------------
  // Load Course Offerings
  // ----------------------------
  const fetchCourseOfferings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCourseOfferings();

      setCourseOfferings(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load course offerings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Load Assessments
  // ----------------------------
  const loadAssessments = async (offeringId) => {
    if (!offeringId) {
      setAssessments([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getAssessmentsByCourseOffering(
          offeringId
        );

      setAssessments(response.data || []);
    } catch (error) {
      console.error(error);

      setAssessments([]);

      setError(
        error.response?.data?.message ||
          "Failed to load assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Initial Data
  // ----------------------------
  if (
    courseOfferings.length === 0 &&
    !loading &&
    !error
  ) {
    fetchCourseOfferings();
  }

  // ----------------------------
  // Course Offering Change
  // ----------------------------
  const handleCourseOfferingChange = async (e) => {
    const value = e.target.value;

    setCourseOfferingId(value);
    setError("");
    setSuccess("");

    await loadAssessments(value);
  };

  // ----------------------------
  // Reset Form
  // ----------------------------
  const resetForm = () => {
    setName("");
    setType("");
    setMaxMarks("");
    setError("");
    setShowForm(false);
  };

  // ----------------------------
  // Validate Form
  // ----------------------------
  const validateForm = () => {
    if (!courseOfferingId) {
      setError("Please select a course offering.");
      return false;
    }

    if (!name.trim()) {
      setError("Please enter assessment name.");
      return false;
    }

    if (!type) {
      setError("Please select assessment type.");
      return false;
    }

    if (!maxMarks) {
      setError("Please enter maximum marks.");
      return false;
    }

    if (Number(maxMarks) <= 0) {
      setError(
        "Maximum marks must be greater than 0."
      );
      return false;
    }

    if (
      type === "ATTENDANCE" &&
      Number(maxMarks) !== 10
    ) {
      setError(
        "Attendance assessment must be 10 marks."
      );
      return false;
    }

    return true;
  };

  // ----------------------------
  // Create Assessment
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

      await createAssessment(
        courseOfferingId,
        name.trim(),
        type,
        maxMarks
      );

      setSuccess(
        "Assessment created successfully."
      );

      setName("");
      setType("");
      setMaxMarks("");

      await loadAssessments(courseOfferingId);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create assessment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Assessment Management
        </h1>

        <p className="mt-2 text-gray-500">
          Create and manage assessment structures
          for course offerings.
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
              Assessment List
            </h2>

            <p className="text-sm text-gray-500">
              Total Assessments: {assessments.length}
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
              : "+ Add Assessment"}
          </button>

        </div>

        {/* Course Offering Selection */}
        <div className="border-b bg-gray-50 p-6">

          <div className="max-w-xl">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course Offering
            </label>

            <select
              value={courseOfferingId}
              onChange={handleCourseOfferingChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">
                Select Course Offering
              </option>

              {courseOfferings.map((offering) => (
                <option
                  key={offering.id}
                  value={offering.id}
                >
                  {offering.course?.code} —{" "}
                  {offering.course?.name} (
                  {
                    offering.academicSemester?.name
                  }
                  )
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* Form */}
        {showForm && (
          <div className="border-b bg-gray-50 p-6">

            <h3 className="mb-5 text-lg font-semibold text-gray-800">
              Create Assessment
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                {/* Assessment Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assessment Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="e.g. Attendance"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Assessment Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assessment Type
                  </label>

                  <select
                    value={type}
                    onChange={(e) => {
                      const value = e.target.value;

                      setType(value);

                      if (value === "ATTENDANCE") {
                        setMaxMarks("10");
                      } else {
                        setMaxMarks("");
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">
                      Select Type
                    </option>

                    <option value="ATTENDANCE">
                      Attendance
                    </option>

                    <option value="MIDTERM">
                      Midterm
                    </option>

                    <option value="EVALUATION">
                      Evaluation
                    </option>
                  </select>
                </div>

                {/* Max Marks */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Maximum Marks
                  </label>

                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) =>
                      setMaxMarks(e.target.value)
                    }
                    placeholder="Enter maximum marks"
                    min="1"
                    disabled={type === "ATTENDANCE"}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    required
                  />
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
                    ? "Creating..."
                    : "Create Assessment"}
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

          {!courseOfferingId ? (
            <div className="p-8 text-center text-gray-500">
              Please select a course offering to view
              assessments.
            </div>
          ) : loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading assessments...
            </div>
          ) : assessments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No assessments found for this course
              offering.
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-gray-50 text-left">
                <tr className="border-b">

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Assessment Name
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Type
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Max Marks
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">

                {assessments.map(
                  (assessment, index) => (
                    <tr
                      key={assessment.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {assessment.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {assessment.type}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {assessment.maxMarks}
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

export default Assessments;

