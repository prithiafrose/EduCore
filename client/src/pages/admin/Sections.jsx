import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

import {
  getAllSections,
  createSection,
  updateSection,
  deleteSection,
} from "../../services/sectionApi";

import { getCourseOfferings } from "../../services/courseOfferingApi";

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [offerings, setOfferings] = useState([]);

  const [name, setName] = useState("");
  const [courseOfferingId, setCourseOfferingId] =
    useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load sections
  const loadSections = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllSections();

      setSections(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load sections"
      );
    } finally {
      setLoading(false);
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadSections(),
        loadOfferings(),
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
    setName("");
    setCourseOfferingId("");

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
    if (!name.trim()) {
      setError("Please enter a section name");
      return false;
    }

    if (!courseOfferingId) {
      setError("Please select a course offering");
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
        await updateSection(
          editingId,
          name.trim(),
          courseOfferingId
        );

        setSuccess("Section updated successfully.");
      } else {
        await createSection(
          name.trim(),
          courseOfferingId
        );

        setSuccess("Section created successfully.");
      }

      resetForm();

      await loadSections();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save section"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Edit section
  const handleEdit = (section) => {
    clearMessages();

    setEditingId(section.id);
    setName(section.name);
    setCourseOfferingId(String(section.courseOfferingId));

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete section
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this section?"
    );

    if (!confirmed) {
      return;
    }

    clearMessages();

    try {
      await deleteSection(id);

      setSuccess("Section deleted successfully.");

      await loadSections();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete section"
      );
    }
  };

  // Cancel
  const handleCancel = () => {
    resetForm();

    clearMessages();
  };

  // Search
  const filteredSections = sections.filter((section) => {
    const searchText = search.toLowerCase();

    return (
      section.name
        ?.toLowerCase()
        .includes(searchText) ||
      section.courseOffering?.course?.code
        ?.toLowerCase()
        .includes(searchText) ||
      section.courseOffering?.course?.name
        ?.toLowerCase()
        .includes(searchText) ||
      section.courseOffering?.academicSemester
        ?.name
        ?.toLowerCase()
        .includes(searchText) ||
      section.courseOffering?.academicSemester
        ?.program
        ?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex">
        <AdminSidebar current="sections" />

        <main className="ml-64 flex-1 min-w-0">
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-slate-500">
              Loading sections...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar current="sections" />

      <main className="ml-64 flex-1 min-w-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Section Management
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage sections for course offerings
                </p>
              </div>

              <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Sections
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {sections.length}
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
                    ? "Edit Section"
                    : "Add New Section"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId !== null
                    ? "Update the section information."
                    : "Add a section to a course offering."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                {/* Section Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Section Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="e.g. Section A"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Course Offering */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Course Offering
                  </label>

                  <select
                    value={courseOfferingId}
                    onChange={(e) =>
                      setCourseOfferingId(
                        e.target.value
                      )
                    }
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
                      ? "Update Section"
                      : "Add Section"}
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

          {/* Section List */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {/* List Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Sections
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage sections
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
                  placeholder="Search sections..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
                />

                {/* Add Button */}
                {!showForm && (
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Add Section
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredSections.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-medium text-slate-700">
                  No sections found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Try a different search or add a new section.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Section
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Course
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Code
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Semester
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Program
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSections.map((section) => (
                      <tr
                        key={section.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        {/* Section */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {section.name || "—"}
                          </p>
                        </td>

                        {/* Course */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {section.courseOffering?.course
                              ?.name || "—"}
                          </p>
                        </td>

                        {/* Code */}
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                            {section.courseOffering?.course
                              ?.code || "—"}
                          </span>
                        </td>

                        {/* Semester */}
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
                            {section.courseOffering
                              ?.academicSemester?.name ||
                              "—"}
                          </span>
                        </td>

                        {/* Program */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {section.courseOffering
                              ?.academicSemester?.program
                              ?.name || "—"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(section)
                              }
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  section.id
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
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

export default Sections;