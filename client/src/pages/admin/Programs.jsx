import { useEffect, useState } from "react";

import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../../services/programApi";

import { getDepartments } from "../../services/departmentApi";


function Programs() {

  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [programType, setProgramType] = useState("BACHELOR");
  const [durationYears, setDurationYears] = useState("");
  const [totalSemesters, setTotalSemesters] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);


  // Load programs and departments
  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const [programData, departmentData] =
        await Promise.all([
          getPrograms(),
          getDepartments(),
        ]);

      setPrograms(programData);
      setDepartments(departmentData);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load programs"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadData();
  }, []);


  // Program type change
  const handleProgramTypeChange = (value) => {

    setProgramType(value);

    if (value === "BACHELOR") {

      setDurationYears("4");
      setTotalSemesters("8");

    } else if (value === "MASTER") {

      setDurationYears("2");
      setTotalSemesters("4");

    } else {

      setDurationYears("");
      setTotalSemesters("");

    }

  };


  // Reset form
  const resetForm = () => {

    setName("");
    setCode("");
    setProgramType("BACHELOR");
    setDurationYears("");
    setTotalSemesters("");
    setDepartmentId("");

    setEditingId(null);
    setShowForm(false);

  };


  // Add form
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

        await updateProgram(
          editingId,
          name,
          code,
          programType,
          durationYears,
          totalSemesters,
          departmentId
        );

        setSuccess(
          "Program updated successfully."
        );

      } else {

        await createProgram(
          name,
          code,
          programType,
          durationYears,
          totalSemesters,
          departmentId
        );

        setSuccess(
          "Program created successfully."
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
            ? "Failed to update program"
            : "Failed to create program"
        )
      );

    } finally {

      setSaving(false);

    }

  };


  // Edit program
  const handleEdit = (program) => {

    setEditingId(program.id);

    setName(program.name || "");
    setCode(program.code || "");

    setProgramType(
      program.programType || "BACHELOR"
    );

    setDurationYears(
      program.durationYears !== null &&
      program.durationYears !== undefined
        ? String(program.durationYears)
        : ""
    );

    setTotalSemesters(
      program.totalSemesters !== null &&
      program.totalSemesters !== undefined
        ? String(program.totalSemesters)
        : ""
    );

    setDepartmentId(
      program.departmentId !== null &&
      program.departmentId !== undefined
        ? String(program.departmentId)
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


  // Delete program
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) return;

    try {

      setError("");
      setSuccess("");

      await deleteProgram(id);

      setSuccess(
        "Program deleted successfully."
      );

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete program"
      );

    }

  };


  // Search
  const filteredPrograms =
    programs.filter((program) => {

      const searchText =
        search.toLowerCase();

      return (
        program.name
          ?.toLowerCase()
          .includes(searchText) ||

        program.code
          ?.toLowerCase()
          .includes(searchText) ||

        program.programType
          ?.toLowerCase()
          .includes(searchText) ||

        program.department?.name
          ?.toLowerCase()
          .includes(searchText) ||

        program.department?.code
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 p-6">

        <div className="flex min-h-[300px] items-center justify-center">

          <p className="text-sm text-slate-500">
            Loading programs...
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
              Program Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage university academic programs
            </p>

          </div>


          {/* Total Programs */}

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Programs
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {programs.length}
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
                ? "Edit Program"
                : "Add New Program"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {editingId !== null
                ? "Update the academic program information."
                : "Create a new academic program."}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >


            {/* Program Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Program Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Software Engineering"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Program Code */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Program Code
              </label>

              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="SWE"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Program Type */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Program Type
              </label>

              <select
                value={programType}
                onChange={(e) =>
                  handleProgramTypeChange(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="BACHELOR">
                  Bachelor
                </option>

                <option value="MASTER">
                  Master
                </option>

                <option value="PHD">
                  PhD
                </option>

              </select>

            </div>


            {/* Department */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department
              </label>

              <select
                value={departmentId}
                onChange={(e) =>
                  setDepartmentId(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >

                <option value="">
                  Select a department
                </option>

                {departments.map(
                  (department) => (

                    <option
                      key={department.id}
                      value={String(department.id)}
                    >
                      {department.name} (
                      {department.code})
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Duration */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Duration (Years)
              </label>

              <input
                type="number"
                min="1"
                value={durationYears}
                onChange={(e) =>
                  setDurationYears(
                    e.target.value
                  )
                }
                placeholder="4"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Total Semesters */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Total Semesters
              </label>

              <input
                type="number"
                min="1"
                value={totalSemesters}
                onChange={(e) =>
                  setTotalSemesters(
                    e.target.value
                  )
                }
                placeholder="8"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

            </div>


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Program"
                  : "Add Program"}

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


      {/* Program List */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Programs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage academic programs
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
              placeholder="Search programs..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Add Button */}

            {!showForm && (

              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Program
              </button>

            )}

          </div>

        </div>


        {/* Empty State */}

        {filteredPrograms.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-700">
              No programs found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new program.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Program
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Code
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Duration
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Semesters
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredPrograms.map(
                  (program) => (

                    <tr
                      key={program.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >


                      {/* Program */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {program.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Program ID: {program.id}
                        </p>

                      </td>


                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                          {program.code}
                        </span>

                      </td>


                      {/* Type */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          {program.programType || "—"}
                        </span>

                      </td>


                      {/* Duration */}

                      <td className="px-6 py-4 text-sm text-slate-600">

                        {program.durationYears
                          ? `${program.durationYears} years`
                          : "—"}

                      </td>


                      {/* Semesters */}

                      <td className="px-6 py-4 text-sm text-slate-600">

                        {program.totalSemesters ?? "—"}

                      </td>


                      {/* Department */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {program.department?.name || "—"}
                        </p>

                        {program.department?.code && (

                          <p className="mt-1 text-xs text-slate-400">
                            {program.department.code}
                          </p>

                        )}

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(program)
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                program.id
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


export default Programs;