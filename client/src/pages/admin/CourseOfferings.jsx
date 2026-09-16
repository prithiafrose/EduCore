import { useEffect, useState } from "react";

import {
  getCourseOfferings,
  createCourseOffering,
  updateCourseOffering,
  deleteCourseOffering,
} from "../../services/courseOfferingApi";

import { getCourses } from "../../services/courseApi";
import { getTeachers } from "../../services/teacherApi";
import {
  createTeacherAssignment,
  deleteTeacherAssignment,
} from "../../services/teacherAssignmentApi";

import api from "../../services/axios";


const CourseOfferings = () => {

  const [offerings, setOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [academicSemesterId, setAcademicSemesterId] =
    useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [teacherAssignments, setTeacherAssignments] =
    useState([]);
  const [allSections, setAllSections] = useState([]);

  const [assignOfferingId, setAssignOfferingId] =
    useState("");
  const [assignTeacherId, setAssignTeacherId] =
    useState("");
  const [assignSectionId, setAssignSectionId] =
    useState("");

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);


  // Load course offerings
  const loadOfferings = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getCourseOfferings();

      setOfferings(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load course offerings"
      );

    } finally {

      setLoading(false);

    }

  };


  // Load courses
  const loadCourses = async () => {

    try {

      const data = await getCourses();

      setCourses(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load courses"
      );

    }

  };


  // Load academic semesters
  const loadSemesters = async () => {

    try {

      const response = await api.get(
        "/academic-semesters"
      );

      setSemesters(response.data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load academic semesters"
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

      setError(
        error.response?.data?.message ||
        "Failed to load teachers"
      );

    }

  };


  // Load teacher assignments
  const loadTeacherAssignments = async () => {

    try {

      const response = await api.get(
        "/teacher-assignments"
      );

      setTeacherAssignments(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load teacher assignments"
      );

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

      setError(
        error.response?.data?.message ||
        "Failed to load sections"
      );

    }

  };


  // Load initial data
  useEffect(() => {

    const loadInitialData = async () => {

      await Promise.all([
        loadOfferings(),
        loadCourses(),
        loadSemesters(),
        loadTeachers(),
        loadTeacherAssignments(),
        loadSections(),
      ]);

    };

    loadInitialData();

  }, []);


  // Clear messages
  const clearMessages = () => {

    setError("");
    setSuccess("");

  };


  // Reset form
  const resetForm = () => {

    setCourseId("");
    setAcademicSemesterId("");

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

    if (!courseId) {

      setError("Please select a course");

      return false;

    }


    if (!academicSemesterId) {

      setError(
        "Please select an academic semester"
      );

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

    try {

      setFormLoading(true);

      if (editingId !== null) {

        await updateCourseOffering(
          editingId,
          courseId,
          academicSemesterId
        );

        setSuccess(
          "Course offering updated successfully."
        );

      } else {

        await createCourseOffering(
          courseId,
          academicSemesterId
        );

        setSuccess(
          "Course offering created successfully."
        );

      }

      resetForm();

      await loadOfferings();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save course offering"
      );

    } finally {

      setFormLoading(false);

    }

  };


  // Edit offering
  const handleEdit = (offering) => {

    clearMessages();

    setEditingId(offering.id);

    setCourseId(
      String(offering.courseId)
    );

    setAcademicSemesterId(
      String(offering.academicSemesterId)
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete offering
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this course offering?"
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {

      await deleteCourseOffering(id);

      setSuccess(
        "Course offering deleted successfully."
      );

      await loadOfferings();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete course offering"
      );

    }

  };


  // Cancel
  const handleCancel = () => {

    resetForm();

    clearMessages();

  };


  // Assign teacher to an offering
  const handleAssignTeacher = async (e) => {

    e.preventDefault();

    clearMessages();

    if (!assignOfferingId || !assignTeacherId) {

      setError(
        "Please select a course offering and a teacher."
      );

      return;

    }

    try {

      setAssignLoading(true);

      await createTeacherAssignment(
        assignTeacherId,
        assignOfferingId,
        assignSectionId || null
      );

      setSuccess(
        "Teacher assigned to the course offering successfully."
      );

      setAssignOfferingId("");
      setAssignTeacherId("");
      setAssignSectionId("");
      setShowAssignForm(false);

      await loadTeacherAssignments();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to assign teacher to the course offering."
      );

    } finally {

      setAssignLoading(false);

    }

  };


  // Teacher currently assigned to an offering
  const getAssignedTeacher = (offeringId) => {

    const assignment = teacherAssignments.find(
      (item) =>
        Number(item.courseOfferingId) ===
        Number(offeringId)
    );

    return assignment?.teacher || null;

  };


  // Unassign teacher from an offering
  const handleUnassignTeacher = async (
    offeringId,
    teacherId
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to remove this teacher from the course offering?"
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {

      const assignment = teacherAssignments.find(
        (item) =>
          Number(item.courseOfferingId) ===
            Number(offeringId) &&
          Number(item.teacherId) === Number(teacherId)
      );

      if (!assignment) {
        return;
      }

      await deleteTeacherAssignment(assignment.id);

      setSuccess(
        "Teacher removed from the course offering successfully."
      );

      await loadTeacherAssignments();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to remove teacher from the course offering."
      );

    }

  };


  // Search
  const filteredOfferings =
    offerings.filter((offering) => {

      const searchText =
        search.toLowerCase();

      return (
        offering.course?.code
          ?.toLowerCase()
          .includes(searchText) ||

        offering.course?.name
          ?.toLowerCase()
          .includes(searchText) ||

        offering.academicSemester
          ?.name
          ?.toLowerCase()
          .includes(searchText) ||

        offering.academicSemester
          ?.program
          ?.name
          ?.toLowerCase()
          .includes(searchText) ||

        offering.academicSemester
          ?.program
          ?.code
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // Loading state
  if (loading) {

    return (

          <div className="flex min-h-[300px] items-center justify-center">

            <p className="text-sm text-slate-500">
              Loading course offerings...
            </p>

          </div>

    );

  }


  return (

      <div className="p-6">


      {/* Header */}

      <div className="mb-8">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-white">
                Course Offering Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage courses offered in academic semesters
              </p>

            </div>

            </div>


          {/* Total Offerings */}

          <div className="rounded-xl bg-white/[0.03] px-4 py-3 shadow-sm ring-1 ring-white/10">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Offerings
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {offerings.length}
            </p>

          </div>

        </div>

      </div>


      {/* Success Message */}

      {success && (

        <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
          {success}
        </div>

      )}


      {/* Error Message */}

      {error && (

        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
          {error}
        </div>

      )}


      {/* Form */}

      {showForm && (

        <div className="mb-8 rounded-2xl bg-white/[0.03] p-6 shadow-sm ring-1 ring-white/10">


          <div className="mb-6">

            <h2 className="text-lg font-semibold text-white">

              {editingId !== null
                ? "Edit Course Offering"
                : "Add New Course Offering"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {editingId !== null
                ? "Update the course offering information."
                : "Assign a course to an academic semester."}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >


            {/* Course */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Course
              </label>

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select a course
                </option>

                {courses.map(
                  (course) => (

                    <option
                      key={course.id}
                      value={String(course.id)}
                    >
                      {course.code} - {course.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Academic Semester */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Academic Semester
              </label>

              <select
                value={academicSemesterId}
                onChange={(e) =>
                  setAcademicSemesterId(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select an academic semester
                </option>

                {semesters.map(
                  (semester) => (

                    <option
                      key={semester.id}
                      value={String(semester.id)}
                    >
                      {semester.program?.name ||
                        "Program"}{" "}
                      - {semester.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={formLoading}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {formLoading
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Offering"
                  : "Add Offering"}

              </button>


              <button
                type="button"
                onClick={handleCancel}
                disabled={formLoading}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Assign Teacher Form */}

      {showAssignForm && (

        <div className="mb-8 rounded-2xl bg-white/[0.03] p-6 shadow-sm ring-1 ring-white/10">


          <div className="mb-6">

            <h2 className="text-lg font-semibold text-white">
              Assign Teacher to Offering
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Assign a teacher to a course offering (optionally per section).
            </p>

          </div>


          <form
            onSubmit={handleAssignTeacher}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >


            {/* Offering */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Course Offering
              </label>

              <select
                value={assignOfferingId}
                onChange={(e) =>
                  setAssignOfferingId(e.target.value)
                }
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select an offering
                </option>

                {offerings.map((offering) => (

                  <option
                    key={offering.id}
                    value={String(offering.id)}
                  >
                    {offering.course?.code || "Course"} -{" "}
                    {offering.academicSemester?.name || "Semester"}
                  </option>

                ))}

              </select>

            </div>


            {/* Teacher */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Teacher
              </label>

              <select
                value={assignTeacherId}
                onChange={(e) =>
                  setAssignTeacherId(e.target.value)
                }
                required
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select a teacher
                </option>

                {teachers.map((teacher) => (

                  <option
                    key={teacher.id}
                    value={String(teacher.id)}
                  >
                    {teacher.name || "Teacher"}{" "}
                    ({teacher.designation || "No designation"})
                  </option>

                ))}

              </select>

            </div>


            {/* Section (optional) */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Section (optional)
              </label>

              <select
                value={assignSectionId}
                onChange={(e) =>
                  setAssignSectionId(e.target.value)
                }
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  No section
                </option>

                {allSections.map((section) => (

                  <option
                    key={section.id}
                    value={String(section.id)}
                  >
                    {section.name || `Section ${section.id}`}
                  </option>

                ))}

              </select>

            </div>


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-3">

              <button
                type="submit"
                disabled={assignLoading}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {assignLoading
                  ? "Assigning..."
                  : "Assign Teacher"}
              </button>


              <button
                type="button"
                onClick={() => {
                  setShowAssignForm(false);
                  clearMessages();
                }}
                disabled={assignLoading}
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Course Offering List */}

      <div className="rounded-2xl bg-white/[0.03] shadow-sm ring-1 ring-white/10">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-white">
              Course Offerings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage course offerings
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
              placeholder="Search offerings..."
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Assign Teacher Button */}

            <button
              type="button"
              onClick={() => {
                clearMessages();
                setShowAssignForm(true);
                setShowForm(false);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/15"
            >
              Assign Teacher
            </button>


            {/* Add Button */}

            {!showForm && !showAssignForm && (

              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Offering
              </button>

            )}

          </div>

        </div>


        {/* Empty State */}

        {filteredOfferings.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-200">
              No course offerings found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new course offering.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-white/10 bg-white/5">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Code
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Program
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Teacher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Offering ID
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOfferings.map(
                  (offering) => (

                    <tr
                      key={offering.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5"
                    >


                      {/* Course */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-white">
                          {offering.course?.name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Course
                        </p>

                      </td>


                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">
                          {offering.course?.code || "—"}
                        </span>

                      </td>


                      {/* Program */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-200">
                          {offering.academicSemester
                            ?.program
                            ?.name || "—"}
                        </p>

                        {offering.academicSemester
                          ?.program
                          ?.code && (

                          <p className="mt-1 text-xs text-slate-500">
                            {offering.academicSemester.program.code}
                          </p>

                        )}

                      </td>


                      {/* Semester */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300">
                          {offering.academicSemester
                            ?.name || "—"}
                        </span>

                      </td>


                      {/* Teacher */}

                      <td className="px-6 py-4">

                        {(() => {

                          const teacher = getAssignedTeacher(
                            offering.id
                          );

                          if (!teacher) {

                            return (
                              <span className="text-sm text-slate-500">
                                No teacher assigned
                              </span>
                            );

                          }

                          return (

                            <div>

                              <p className="text-sm font-medium text-slate-200">
                                {teacher.name || "Teacher"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {teacher.designation ||
                                  "No designation"}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  handleUnassignTeacher(
                                    offering.id,
                                    teacher.id
                                  )
                                }
                                className="mt-2 rounded-lg border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                              >
                                Unassign
                              </button>

                            </div>

                          );

                        })()}

                      </td>


                      {/* ID */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-500">
                          {offering.id}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                offering
                              )
                            }
                            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                offering.id
                              )
                            }
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
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

          </div>

        )}

      </div>

      </div>

  );

};


export default CourseOfferings;