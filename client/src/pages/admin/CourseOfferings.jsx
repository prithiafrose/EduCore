import { useEffect, useState } from "react";

import {
  getCourseOfferings,
  createCourseOffering,
  updateCourseOffering,
  deleteCourseOffering,
} from "../../services/courseOfferingApi";

import { getCourses } from "../../services/courseApi";

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


  // Load initial data
  useEffect(() => {

    const loadInitialData = async () => {

      await Promise.all([
        loadOfferings(),
        loadCourses(),
        loadSemesters(),
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

      <div className="min-h-screen bg-slate-50 p-6">

        <div className="flex min-h-[300px] items-center justify-center">

          <p className="text-sm text-slate-500">
            Loading course offerings...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-slate-50 p-6">


      {/* Header */}

      <div className="mb-8">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Course Offering Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage courses offered in academic semesters
            </p>

          </div>


          {/* Total Offerings */}

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Offerings
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {offerings.length}
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

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course
              </label>

              <select
                value={courseId}
                onChange={(e) =>
                  setCourseId(e.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

              <label className="mb-2 block text-sm font-medium text-slate-700">
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
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Course Offering List */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Add Button */}

            {!showForm && (

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

            <p className="font-medium text-slate-700">
              No course offerings found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new course offering.
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
                    Code
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Program
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester
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
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >


                      {/* Course */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {offering.course?.name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Course
                        </p>

                      </td>


                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                          {offering.course?.code || "—"}
                        </span>

                      </td>


                      {/* Program */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {offering.academicSemester
                            ?.program
                            ?.name || "—"}
                        </p>

                        {offering.academicSemester
                          ?.program
                          ?.code && (

                          <p className="mt-1 text-xs text-slate-400">
                            {offering.academicSemester.program.code}
                          </p>

                        )}

                      </td>


                      {/* Semester */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                          {offering.academicSemester
                            ?.name || "—"}
                        </span>

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
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
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
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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