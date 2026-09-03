import { useEffect, useState } from "react";

import {
  getAcademicSemesters,
  createAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester,
} from "../../services/academicSemesterApi";

import { getPrograms } from "../../services/programApi";


function AcademicSemesters() {

  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [programId, setProgramId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load semesters and programs
  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const [semesterData, programData] =
        await Promise.all([
          getAcademicSemesters(),
          getPrograms(),
        ]);

      setSemesters(semesterData);
      setPrograms(programData);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load academic semesters"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadData();
  }, []);


  // Get semester limit based on program
  const getProgramLimit = () => {

    if (!programId) {
      return null;
    }

    const selectedProgram = programs.find(
      (program) =>
        String(program.id) === String(programId)
    );

    if (!selectedProgram) {
      return null;
    }

    if (selectedProgram.programType === "BACHELOR") {
      return 8;
    }

    if (selectedProgram.programType === "MASTER") {
      return 4;
    }

    return null;

  };


  // Program change
  const handleProgramChange = (value) => {

    setProgramId(value);

    if (editingId === null) {
      setOrder("");
    }

  };


  // Reset form
  const resetForm = () => {

    setName("");
    setOrder("");
    setProgramId("");

    setEditingId(null);
    setShowForm(false);

  };


  // Open add form
  const handleAdd = () => {

    resetForm();

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Create / Update
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {

      if (editingId !== null) {

        await updateAcademicSemester(
          editingId,
          name,
          order,
          programId
        );

        setSuccess(
          "Academic semester updated successfully."
        );

      } else {

        await createAcademicSemester(
          name,
          order,
          programId
        );

        setSuccess(
          "Academic semester created successfully."
        );

      }

      resetForm();

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        (
          editingId !== null
            ? "Failed to update academic semester"
            : "Failed to create academic semester"
        )
      );

    } finally {

      setSaving(false);

    }

  };


  // Edit semester
  const handleEdit = (semester) => {

    setEditingId(semester.id);

    setName(semester.name || "");

    setOrder(
      semester.order !== null &&
      semester.order !== undefined
        ? String(semester.order)
        : ""
    );

    setProgramId(
      semester.programId !== null &&
      semester.programId !== undefined
        ? String(semester.programId)
        : ""
    );

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete semester
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this academic semester?"
    );

    if (!confirmed) return;

    try {

      setError("");
      setSuccess("");

      await deleteAcademicSemester(id);

      setSuccess(
        "Academic semester deleted successfully."
      );

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete academic semester"
      );

    }

  };


  // Search
  const filteredSemesters =
    semesters.filter((semester) => {

      const searchText =
        search.toLowerCase();

      return (
        semester.name
          ?.toLowerCase()
          .includes(searchText) ||

        semester.program?.name
          ?.toLowerCase()
          .includes(searchText) ||

        semester.program?.code
          ?.toLowerCase()
          .includes(searchText) ||

        String(semester.order)
          .includes(searchText)
      );

    });


  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-6">

        <div className="flex min-h-[300px] items-center justify-center">

          <p className="text-sm text-slate-500">
            Loading academic semesters...
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
              Academic Semester Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage academic semesters for university programs
            </p>

          </div>


          {/* Total Semesters */}

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Semesters
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {semesters.length}
            </p>

          </div>

        </div>

      </div>


      {/* Messages */}

      {success && (

        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>

      )}


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
                ? "Edit Academic Semester"
                : "Add New Academic Semester"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {editingId !== null
                ? "Update the academic semester information."
                : "Create a semester for an academic program."}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >


            {/* Semester Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Semester Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="1st Semester"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Semester Order */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Semester Order
              </label>

              <input
                type="number"
                min="1"
                max={getProgramLimit() || undefined}
                value={order}
                onChange={(e) =>
                  setOrder(e.target.value)
                }
                placeholder="1"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              {getProgramLimit() && (

                <p className="mt-2 text-xs text-slate-400">
                  Maximum {getProgramLimit()} semesters for this program
                </p>

              )}

            </div>


            {/* Program */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Academic Program
              </label>

              <select
                value={programId}
                onChange={(e) =>
                  handleProgramChange(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select a program
                </option>

                {programs.map(
                  (program) => (

                    <option
                      key={program.id}
                      value={String(program.id)}
                    >
                      {program.name} (
                      {program.code})
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Semester"
                  : "Add Semester"}

              </button>


              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Semester List */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Academic Semesters
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage program semesters
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
              placeholder="Search semesters..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Add Button */}

            {!showForm && (

              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Semester
              </button>

            )}

          </div>

        </div>


        {/* Empty State */}

        {filteredSemesters.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-700">
              No academic semesters found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new semester.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Program
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Program Code
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semester ID
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSemesters.map(
                  (semester) => (

                    <tr
                      key={semester.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >


                      {/* Semester */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {semester.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Academic Semester
                        </p>

                      </td>


                      {/* Order */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                          {semester.order}
                        </span>

                      </td>


                      {/* Program */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {semester.program?.name || "—"}
                        </p>

                      </td>


                      {/* Program Code */}

                      <td className="px-6 py-4">

                        {semester.program?.code ? (

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {semester.program.code}
                          </span>

                        ) : (

                          <span className="text-sm text-slate-400">
                            —
                          </span>

                        )}

                      </td>


                      {/* ID */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-500">
                          {semester.id}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                semester
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
                                semester.id
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

}


export default AcademicSemesters;