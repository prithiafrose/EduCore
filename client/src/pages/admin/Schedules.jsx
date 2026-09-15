import { useEffect, useState } from "react";

import {
  getAllTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../../services/timetableApi";

import { getCourseOfferings } from "../../services/courseOfferingApi";
import { getAllTeacherAssignments } from "../../services/teacherAssignmentApi";

import api from "../../services/axios";

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Schedules = () => {
  const [timetables, setTimetables] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [sections, setSections] = useState([]);
  const [teacherAssignments, setTeacherAssignments] = useState(
    []
  );

  const [courseOfferingId, setCourseOfferingId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [teacherAssignmentId, setTeacherAssignmentId] =
    useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");

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

      const [timetableData, offeringData, assignmentData] =
        await Promise.all([
          getAllTimetables(),
          getCourseOfferings(),
          getAllTeacherAssignments(),
        ]);

      setTimetables(timetableData);
      setCourseOfferings(offeringData);
      setTeacherAssignments(assignmentData);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load schedules."
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
  // Filter teacher assignments by offering
  // ----------------------------
  const getAssignmentsForOffering = (offeringId) => {
    return teacherAssignments.filter(
      (assignment) =>
        Number(assignment.courseOfferingId) ===
        Number(offeringId)
    );
  };

  // ----------------------------
  // Course Offering Change
  // ----------------------------
  const handleCourseOfferingChange = async (e) => {
    const value = e.target.value;

    setCourseOfferingId(value);
    setSectionId("");
    setTeacherAssignmentId("");

    await loadSections(value);
  };

  // ----------------------------
  // Reset Form
  // ----------------------------
  const resetForm = () => {
    setCourseOfferingId("");
    setSectionId("");
    setTeacherAssignmentId("");
    setDayOfWeek("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setEditingId(null);
    setShowForm(false);
    setSections([]);
    setError("");
  };

  // ----------------------------
  // Validate Form
  // ----------------------------
  const validateForm = () => {
    if (!courseOfferingId) {
      setError("Please select a course offering.");
      return false;
    }

    if (!teacherAssignmentId) {
      setError("Please select a teacher.");
      return false;
    }

    if (dayOfWeek === "") {
      setError("Please select a day.");
      return false;
    }

    if (!startTime) {
      setError("Please select a start time.");
      return false;
    }

    if (!endTime) {
      setError("Please select an end time.");
      return false;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time.");
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

      // Build DateTime using a fixed base date
      const baseDate = "1970-01-01";

      const payload = {
        courseOfferingId: Number(courseOfferingId),
        sectionId: sectionId ? Number(sectionId) : null,
        teacherAssignmentId: Number(teacherAssignmentId),
        dayOfWeek: Number(dayOfWeek),
        startTime: `${baseDate}T${startTime}:00`,
        endTime: `${baseDate}T${endTime}:00`,
        room: room || null,
      };

      if (editingId) {
        await updateTimetable(editingId, payload);

        setSuccess("Schedule updated successfully.");
      } else {
        await createTimetable(payload);

        setSuccess("Schedule created successfully.");
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save schedule."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------
  // Edit
  // ----------------------------
  const handleEdit = async (timetable) => {
    setError("");
    setSuccess("");

    setEditingId(timetable.id);
    setCourseOfferingId(String(timetable.courseOfferingId));
    setSectionId(
      timetable.sectionId ? String(timetable.sectionId) : ""
    );
    setTeacherAssignmentId(
      String(timetable.teacherAssignmentId)
    );
    setDayOfWeek(String(timetable.dayOfWeek));
    setStartTime(
      new Date(timetable.startTime)
        .toISOString()
        .slice(11, 16)
    );
    setEndTime(
      new Date(timetable.endTime)
        .toISOString()
        .slice(11, 16)
    );
    setRoom(timetable.room || "");

    setShowForm(true);

    await loadSections(timetable.courseOfferingId);

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
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteTimetable(id);

      setSuccess("Schedule deleted successfully.");

      await fetchData();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete schedule."
      );
    }
  };

  // ----------------------------
  // Format time
  // ----------------------------
  const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
      <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Schedule Management
          </h1>

          <p className="mt-2 text-gray-500">
            Create and manage the weekly class timetable.
          </p>
        </div>

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
              Weekly Timetable
            </h2>

            <p className="text-sm text-gray-500">
              Total Slots: {timetables.length}
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
            {showForm ? "Cancel" : "+ Add Schedule"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="border-b bg-gray-50 p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800">
              {editingId
                ? "Edit Schedule"
                : "Create Schedule"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* Course Offering */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Course Offering
                  </label>

                  <select
                    value={courseOfferingId}
                    onChange={handleCourseOfferingChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
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
                        {offering.academicSemester?.name})
                      </option>
                    ))}
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
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher Assignment */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Teacher
                  </label>

                  <select
                    value={teacherAssignmentId}
                    onChange={(e) =>
                      setTeacherAssignmentId(e.target.value)
                    }
                    disabled={!courseOfferingId}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                    required
                  >
                    <option value="">
                      {courseOfferingId
                        ? "Select Teacher"
                        : "Select Course Offering First"}
                    </option>

                    {getAssignmentsForOffering(
                      courseOfferingId
                    ).map((assignment) => (
                      <option
                        key={assignment.id}
                        value={assignment.id}
                      >
                        {assignment.teacher?.name || "Teacher"}
                        {assignment.section
                          ? ` (${assignment.section.name})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Day
                  </label>

                  <select
                    value={dayOfWeek}
                    onChange={(e) =>
                      setDayOfWeek(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  >
                    <option value="">Select Day</option>

                    {DAY_LABELS.map((label, index) => (
                      <option key={index} value={index}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Room
                    <span className="ml-1 text-gray-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    value={room}
                    onChange={(e) =>
                      setRoom(e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Room 101"
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
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                    ? "Update Schedule"
                    : "Create Schedule"}
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
              Loading schedules...
            </div>
          ) : timetables.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No schedules found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr className="border-b">
                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Day
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Time
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Course
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Section
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Teacher
                  </th>

                  <th className="px-5 py-3 text-sm font-semibold text-gray-700">
                    Room
                  </th>

                  <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {timetables.map((timetable, index) => (
                  <tr key={timetable.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {DAY_LABELS[timetable.dayOfWeek] ||
                          "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatTime(timetable.startTime)} —{" "}
                      {formatTime(timetable.endTime)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {timetable.courseOffering?.course
                          ?.code || "N/A"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {timetable.courseOffering?.course
                          ?.name || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {timetable.section?.name || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {timetable.teacherAssignment?.teacher
                        ?.name || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {timetable.room || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(timetable)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(timetable.id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
  );
};

export default Schedules;