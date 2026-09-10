import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

import {
  getAllClassSessions,
  createClassSession,
  updateClassSession,
  cancelClassSession,
  rescheduleClassSession,
} from "../../services/classSessionApi";

import { getCourseOfferings } from "../../services/courseOfferingApi";
import { getTeachers } from "../../services/teacherApi";

import api from "../../services/axios";

const ClassSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [courseOfferingId, setCourseOfferingId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [rescheduling, setRescheduling] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStart, setRescheduleStart] = useState("");
  const [rescheduleEnd, setRescheduleEnd] = useState("");
  const [rescheduleRoom, setRescheduleRoom] = useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load sessions
  const loadSessions = async () => {
    try {
      const response = await getAllClassSessions();

      const data = response?.data || response || [];

      setSessions(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load class sessions"
      );
    }
  };

  // Load course offerings
  const loadOfferings = async () => {
    try {
      const data = await getCourseOfferings();

      setOfferings(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load course offerings"
      );
    }
  };

  // Load teachers
  const loadTeachers = async () => {
    try {
      const data = await getTeachers();

      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  // Load sections
  const loadSections = async () => {
    try {
      const response = await api.get("/sections");

      setAllSections(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError("");

      try {
        await Promise.all([
          loadSessions(),
          loadOfferings(),
          loadTeachers(),
          loadSections(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Sections for a given offering
  const sectionsForOffering = (offeringId) => {
    return allSections.filter(
      (section) =>
        Number(section.courseOfferingId) ===
        Number(offeringId)
    );
  };

  // Reset form
  const resetForm = () => {
    setCourseOfferingId("");
    setSectionId("");
    setTeacherId("");
    setSessionDate("");
    setStartTime("");
    setEndTime("");
    setRoom("");

    setEditingId(null);
    setShowForm(false);
  };

  // Open Add form
  const handleAdd = () => {
    resetForm();

    clearMessages();

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Validate form
  const validateForm = () => {
    if (!courseOfferingId) {
      setError("Please select a course offering");
      return false;
    }

    if (!teacherId) {
      setError("Please select a teacher");
      return false;
    }

    if (!sessionDate) {
      setError("Please select a date");
      return false;
    }

    if (!startTime || !endTime) {
      setError("Please select start and end times");
      return false;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!validateForm()) {
      return;
    }

    const payload = {
      courseOfferingId,
      sectionId: sectionId || null,
      teacherId,
      date: sessionDate,
      startTime: `${sessionDate}T${startTime}`,
      endTime: `${sessionDate}T${endTime}`,
      room,
    };

    try {
      setFormLoading(true);

      if (editingId !== null) {
        await updateClassSession(editingId, payload);

        setSuccess("Class session updated successfully.");
      } else {
        await createClassSession(payload);

        setSuccess("Class session created successfully.");
      }

      resetForm();

      await loadSessions();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save class session"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Edit session
  const handleEdit = (session) => {
    clearMessages();

    setEditingId(session.id);

    setCourseOfferingId(String(session.courseOfferingId));
    setSectionId(
      session.sectionId != null
        ? String(session.sectionId)
        : ""
    );
    setTeacherId(String(session.teacherId));
    setSessionDate(
      new Date(session.date)
        .toISOString()
        .slice(0, 10)
    );
    setStartTime(
      new Date(session.startTime)
        .toISOString()
        .slice(11, 16)
    );
    setEndTime(
      new Date(session.endTime)
        .toISOString()
        .slice(11, 16)
    );
    setRoom(session.room || "");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel session
  const handleCancel = async (session) => {
    const confirmed = window.confirm(
      `Cancel this class session for ${session.courseOffering?.course?.name || "course"}?`
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {
      setActionLoading(true);

      await cancelClassSession(session.id);

      setSuccess("Class session cancelled successfully.");

      await loadSessions();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel class session"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Open reschedule form
  const handleOpenReschedule = (session) => {
    clearMessages();

    setRescheduling(session);

    setRescheduleDate(
      new Date(session.date)
        .toISOString()
        .slice(0, 10)
    );
    setRescheduleStart(
      new Date(session.startTime)
        .toISOString()
        .slice(11, 16)
    );
    setRescheduleEnd(
      new Date(session.endTime)
        .toISOString()
        .slice(11, 16)
    );
    setRescheduleRoom(session.room || "");

    setShowForm(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Submit reschedule
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();

    clearMessages();

    if (!rescheduleDate) {
      setError("Please select a new date");
      return;
    }

    if (!rescheduleStart || !rescheduleEnd) {
      setError("Please select start and end times");
      return;
    }

    if (rescheduleEnd <= rescheduleStart) {
      setError("End time must be after start time");
      return;
    }

    try {
      setActionLoading(true);

      await rescheduleClassSession(rescheduling.id, {
        date: rescheduleDate,
        startTime: `${rescheduleDate}T${rescheduleStart}`,
        endTime: `${rescheduleDate}T${rescheduleEnd}`,
        room: rescheduleRoom,
      });

      setSuccess(
        "Class session rescheduled successfully."
      );

      setRescheduling(null);

      await loadSessions();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to reschedule class session"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel (form close)
  const handleCancelForm = () => {
    resetForm();

    clearMessages();
  };

  // Status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-green-100 text-green-700";

      case "FINISHED":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Search
  const filteredSessions = sessions.filter((session) => {
    const searchText = search.toLowerCase();

    return (
      session.courseOffering?.course?.code
        ?.toLowerCase()
        .includes(searchText) ||
      session.courseOffering?.course?.name
        ?.toLowerCase()
        .includes(searchText) ||
      session.section?.name
        ?.toLowerCase()
        .includes(searchText) ||
      session.teacher?.name
        ?.toLowerCase()
        .includes(searchText) ||
      (session.room || "")
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <AdminSidebar current="class-sessions" />

        <main className="ml-64 flex-1 min-w-0">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading class sessions...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar current="class-sessions" />

      <main className="ml-64 flex-1 min-w-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Class Session Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create, update, cancel and reschedule class sessions
                </p>
              </div>

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Sessions
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {sessions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId !== null
                    ? "Edit Class Session"
                    : "Add New Class Session"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId !== null
                    ? "Update the class session information."
                    : "Schedule a new class session."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
              >
                {/* Course Offering */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Course Offering
                  </label>

                  <select
                    value={courseOfferingId}
                    onChange={(e) => {
                      setCourseOfferingId(
                        e.target.value
                      );
                      setSectionId("");
                    }}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">
                      Select a course offering
                    </option>

                    {offerings.map((offering) => (
                      <option
                        key={offering.id}
                        value={String(offering.id)}
                      >
                        {offering.course?.code || "Course"}{" "}
                        -{" "}
                        {offering.academicSemester
                          ?.name ||
                          "Semester"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Section (optional)
                  </label>

                  <select
                    value={sectionId}
                    onChange={(e) =>
                      setSectionId(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">No section</option>

                    {sectionsForOffering(
                      courseOfferingId
                    ).map((section) => (
                      <option
                        key={section.id}
                        value={String(section.id)}
                      >
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Teacher
                  </label>

                  <select
                    value={teacherId}
                    onChange={(e) =>
                      setTeacherId(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">
                      Select a teacher
                    </option>

                    {teachers.map((teacher) => (
                      <option
                        key={teacher.id}
                        value={String(teacher.id)}
                      >
                        {teacher.name || "Teacher"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date
                  </label>

                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) =>
                      setSessionDate(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Room
                  </label>

                  <input
                    type="text"
                    value={room}
                    onChange={(e) =>
                      setRoom(e.target.value)
                    }
                    placeholder="e.g. Room 501"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {formLoading
                      ? "Saving..."
                      : editingId !== null
                      ? "Update Session"
                      : "Add Session"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelForm}
                    disabled={formLoading}
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reschedule Form */}
          {rescheduling && (
            <div className="mb-8 rounded-2xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-amber-900">
                  Reschedule Class Session
                </h2>

                <p className="mt-1 text-sm text-amber-700">
                  {rescheduling.courseOffering?.course
                    ?.name || "Course"}{" "}
                  on{" "}
                  {new Date(
                    rescheduling.date
                  ).toLocaleDateString()}{" "}
                  will be cancelled and moved.
                </p>
              </div>

              <form
                onSubmit={handleRescheduleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-900">
                    New Date
                  </label>

                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) =>
                      setRescheduleDate(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-900">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={rescheduleStart}
                    onChange={(e) =>
                      setRescheduleStart(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-900">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={rescheduleEnd}
                    onChange={(e) =>
                      setRescheduleEnd(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-amber-900">
                    Room
                  </label>

                  <input
                    type="text"
                    value={rescheduleRoom}
                    onChange={(e) =>
                      setRescheduleRoom(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Room 501"
                    className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div className="flex gap-3 md:col-span-2 lg:col-span-4">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading
                      ? "Rescheduling..."
                      : "Reschedule Session"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRescheduling(null);
                      clearMessages();
                    }}
                    disabled={actionLoading}
                    className="rounded-xl border border-amber-300 bg-white px-6 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Session List */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {/* List Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Class Sessions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage class sessions
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                {/* Search */}
                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search sessions..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
                />

                {/* Add Button */}
                {!showForm && !rescheduling && (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Add Session
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredSessions.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium text-slate-700">
                  No class sessions found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Try a different search or add a new class session.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Course
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Section
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Teacher
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Time
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Room
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        {/* Course */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {session.courseOffering?.course
                              ?.name || "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {session.courseOffering
                              ?.course?.code ||
                              ""}{" "}
                            {session.courseOffering
                              ?.academicSemester
                              ?.name
                              ? `• ${session.courseOffering.academicSemester.name}`
                              : ""}
                          </p>
                        </td>

                        {/* Section */}
                        <td className="px-6 py-4">
                          {session.section ? (
                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                              {session.section.name}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Teacher */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {session.teacher?.name ||
                              session.teacher?.user
                                ?.firstName ||
                              "—"}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(
                            session.date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Time */}
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(
                            session.startTime
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(
                            session.endTime
                          ).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Room */}
                        <td className="px-6 py-4">
                          {session.room ? (
                            <span className="text-sm text-slate-600">
                              {session.room}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              session.status
                            )}`}
                          >
                            {session.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {session.status !==
                              "CANCELLED" &&
                              session.status !==
                                "FINISHED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(session)
                                }
                                disabled={
                                  actionLoading
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                              >
                                Edit
                              </button>
                            )}

                            {session.status !==
                              "CANCELLED" &&
                              session.status !==
                                "FINISHED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    session
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}

                            {session.status !==
                              "FINISHED" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenReschedule(
                                    session
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                                className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                              >
                                Reschedule
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassSessions;