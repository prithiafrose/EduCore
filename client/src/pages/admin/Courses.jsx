import { useEffect, useState } from "react";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/courseApi";


const Courses = () => {

  const [courses, setCourses] = useState([]);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [credit, setCredit] = useState("");
  const [description, setDescription] = useState("");
  const [prerequisiteIds, setPrerequisiteIds] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load courses
  const loadCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getCourses();

      setCourses(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load courses"
      );

    } finally {

      setLoading(false);

    }

  };


  // Load courses when page opens
  useEffect(() => {
    loadCourses();
  }, []);


  // Clear messages
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };


  // Reset form
  const resetForm = () => {

    setCode("");
    setName("");
    setCredit("");
    setDescription("");
    setPrerequisiteIds([]);

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

    const trimmedCode = code.trim();
    const trimmedName = name.trim();

    if (!trimmedCode) {

      setError("Course code is required");

      return false;

    }


    if (!trimmedName) {

      setError("Course name is required");

      return false;

    }


    if (!/[A-Za-z]/.test(trimmedName)) {

      setError(
        "Course name must contain letters"
      );

      return false;

    }


    if (credit === "") {

      setError("Credit is required");

      return false;

    }


    const numericCredit = Number(credit);


    if (
      !Number.isFinite(numericCredit) ||
      numericCredit <= 0
    ) {

      setError(
        "Credit must be a positive number"
      );

      return false;

    }


    return true;

  };


  // Create / Update course
  const handleSubmit = async (e) => {

    e.preventDefault();

    clearMessages();

    if (!validateForm()) {
      return;
    }

    try {

      setFormLoading(true);

      if (editingId !== null) {

        await updateCourse(
          editingId,
          code,
          name,
          credit,
          description,
          prerequisiteIds
        );

        setSuccess(
          "Course updated successfully."
        );

      } else {

        await createCourse(
          code,
          name,
          credit,
          description,
          prerequisiteIds
        );

        setSuccess(
          "Course created successfully."
        );

      }

      resetForm();

      await loadCourses();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save course"
      );

    } finally {

      setFormLoading(false);

    }

  };


  // Edit course
  const handleEdit = (course) => {

    clearMessages();

    setEditingId(course.id);

    setCode(course.code || "");
    setName(course.name || "");
    setCredit(
      course.credit !== null &&
      course.credit !== undefined
        ? String(course.credit)
        : ""
    );

    setDescription(
      course.description || ""
    );

    setPrerequisiteIds(
      course.prerequisites?.map((p) => p.id) || []
    );

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete course
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {

      await deleteCourse(id);

      setSuccess(
        "Course deleted successfully."
      );

      await loadCourses();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete course"
      );

    }

  };


  // Cancel
  const handleCancel = () => {

    resetForm();

    clearMessages();

  };


  // Toggle prerequisite
  const togglePrerequisite = (id) => {

    setPrerequisiteIds((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );

  };


  // Search
  const filteredCourses =
    courses.filter((course) => {

      const searchText =
        search.toLowerCase();

      return (
        course.code
          ?.toLowerCase()
          .includes(searchText) ||

        course.name
          ?.toLowerCase()
          .includes(searchText) ||

        course.description
          ?.toLowerCase()
          .includes(searchText) ||

        String(course.credit)
          .includes(searchText)
      );

    });


  // Available prerequisites (exclude current course when editing)
  const availablePrerequisites =
    courses.filter(
      (c) =>
        editingId === null
          ? true
          : c.id !== editingId
    );


  // Loading state
  if (loading) {

    return (

          <div className="flex min-h-[300px] items-center justify-center">

            <p className="text-sm text-slate-500">
              Loading courses...
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
                Course Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage university courses and course information
              </p>

            </div>

            </div>


          {/* Total Courses */}

          <div className="rounded-xl bg-white/[0.03] px-4 py-3 shadow-sm ring-1 ring-white/10">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Courses
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {courses.length}
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


      {/* Course Form */}

      {showForm && (

        <div className="mb-8 rounded-2xl bg-white/[0.03] p-6 shadow-sm ring-1 ring-white/10">


          <div className="mb-6">

            <h2 className="text-lg font-semibold text-white">

              {editingId !== null
                ? "Edit Course"
                : "Add New Course"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {editingId !== null
                ? "Update the course information."
                : "Create a new university course."}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >


            {/* Course Code */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Course Code
              </label>

              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="e.g. SWE-301"
                required
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Course Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Course Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Software Requirements Engineering"
                required
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Credit */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Credit
              </label>

              <input
                type="number"
                min="0"
                step="0.5"
                value={credit}
                onChange={(e) =>
                  setCredit(e.target.value)
                }
                placeholder="e.g. 3"
                required
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Description */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Course description"
                rows="3"
                className="w-full resize-none rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Prerequisites */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-200">
                Prerequisites
              </label>

              {availablePrerequisites.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No other courses available as prerequisites.
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-white/15 p-4">
                  {availablePrerequisites.map(
                    (course) => (
                      <label
                        key={course.id}
                        className="flex items-center gap-3 py-1.5 cursor-pointer hover:bg-white/5 rounded px-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            prerequisiteIds.includes(course.id)
                          }
                          onChange={() =>
                            togglePrerequisite(course.id)
                          }
                          className="h-4 w-4 rounded border-white/15"
                        />

                        <span className="text-sm text-slate-200">
                          {course.code} — {course.name}
                        </span>

                      </label>
                    )
                  )}
                </div>
              )}

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
                  ? "Update Course"
                  : "Add Course"}

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


      {/* Course List */}

      <div className="rounded-2xl bg-white/[0.03] shadow-sm ring-1 ring-white/10">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-white">
              Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage university courses
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
              placeholder="Search courses..."
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Add Button */}

            {!showForm && (

              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Course
              </button>

            )}

          </div>

        </div>


        {/* Empty State */}

        {filteredCourses.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-200">
              No courses found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new course.
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
                    Credit
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Prerequisites
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredCourses.map(
                  (course) => (

                    <tr
                      key={course.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5"
                    >


                      {/* Course */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-white">
                          {course.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Course ID: {course.id}
                        </p>

                      </td>


                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">
                          {course.code}
                        </span>

                      </td>


                      {/* Credit */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-semibold text-slate-300">
                          {course.credit}
                        </span>

                      </td>


                      {/* Description */}

                      <td className="max-w-md px-6 py-4">

                        <p
                          className="truncate text-sm text-slate-300"
                          title={course.description || ""}
                        >
                          {course.description || "—"}
                        </p>

                      </td>


                      {/* Prerequisites */}

                      <td className="px-6 py-4">

                        {course.prerequisites &&
                        course.prerequisites.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {course.prerequisites.map(
                              (prereq) => (
                                <span
                                  key={prereq.id}
                                  className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300"
                                >
                                  {prereq.code}
                                </span>
                              )
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">
                            —
                          </span>
                        )}

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(course)
                            }
                            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                course.id
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


export default Courses;
