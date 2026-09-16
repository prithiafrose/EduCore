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
  const [isActive, setIsActive] = useState(true);

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
    setIsActive(true);

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
          programId,
          isActive
        );

        setSuccess(
          "Academic semester updated successfully."
        );

      } else {

        await createAcademicSemester(
          name,
          order,
          programId,
          isActive
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

    setIsActive(semester.isActive !== false);

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

          <div className="flex min-h-[300px] items-center justify-center">

            <p className="text-sm text-slate-500">
              Loading academic semesters...
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
                Academic Semester Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage academic semesters for university programs
              </p>

            </div>

            </div>


          {/* Total Semesters */}

          <div className="rounded-xl bg-white/[0.03] px-4 py-3 shadow-sm ring-1 ring-white/10">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Semesters
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {semesters.length}
            </p>

          </div>

        </div>

      </div>


      {/* Messages */}

      {success && (

        <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
          {success}
        </div>

      )}


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

              <label className="mb-2 block text-sm font-medium text-slate-200">
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
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Semester Order */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
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
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              {getProgramLimit() && (

                <p className="mt-2 text-xs text-slate-500">
                  Maximum {getProgramLimit()} semesters for this program
                </p>

              )}

            </div>


            {/* Program */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-200">
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
                className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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


            {/* Active */}

            <div className="flex items-center gap-2 pt-6">

              <input
                type="checkbox"
                id="semesterActive"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
                className="h-4 w-4 rounded border-white/15"
              />

              <label htmlFor="semesterActive" className="text-sm font-medium text-slate-200">
                Active
              </label>

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
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Semester List */}

      <div className="rounded-2xl bg-white/[0.03] shadow-sm ring-1 ring-white/10">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-white">
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
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
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

            <p className="font-medium text-slate-200">
              No academic semesters found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new semester.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-white/10 bg-white/5">

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
                    Status
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
                      className="border-b border-white/5 last:border-0 hover:bg-white/5"
                    >


                      {/* Semester */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-white">
                          {semester.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Academic Semester
                        </p>

                      </td>


                      {/* Order */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">
                          {semester.order}
                        </span>

                      </td>


                      {/* Program */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-200">
                          {semester.program?.name || "—"}
                        </p>

                      </td>


                      {/* Program Code */}

                      <td className="px-6 py-4">

                        {semester.program?.code ? (

                          <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                            {semester.program.code}
                          </span>

                        ) : (

                          <span className="text-sm text-slate-500">
                            —
                          </span>

                        )}

                      </td>


                      {/* Status */}

                      <td className="px-6 py-4">

                        {semester.isActive !== false ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-300">
                            Inactive
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
                            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5"
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

}


export default AcademicSemesters;
