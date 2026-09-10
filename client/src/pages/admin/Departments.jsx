import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

import {
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../services/departmentApi";


function Departments() {

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load departments
  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getDepartments();

      setDepartments(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load departments"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadData();
  }, []);


  // Reset form
  const resetForm = () => {

    setName("");
    setCode("");
    setEditingId(null);
    setShowForm(false);

  };


  // Open add form
  const handleAdd = () => {

    setName("");
    setCode("");
    setEditingId(null);

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

      if (editingId) {

        await updateDepartment(
          editingId,
          name,
          code
        );

        setSuccess(
          "Department updated successfully."
        );

      } else {

        await createDepartment(
          name,
          code
        );

        setSuccess(
          "Department created successfully."
        );

      }

      resetForm();

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        (
          editingId
            ? "Failed to update department"
            : "Failed to create department"
        )
      );

    } finally {

      setSaving(false);

    }

  };


  // Edit department
  const handleEdit = (department) => {

    setEditingId(department.id);

    setName(department.name || "");
    setCode(department.code || "");

    setError("");
    setSuccess("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete department
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) return;

    try {

      setError("");
      setSuccess("");

      await deleteDepartment(id);

      setSuccess(
        "Department deleted successfully."
      );

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete department"
      );

    }

  };


  // Search departments
  const filteredDepartments =
    departments.filter((department) => {

      const searchText =
        search.toLowerCase();

      return (
        department.name
          ?.toLowerCase()
          .includes(searchText) ||

        department.code
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  if (loading) {

    return (

      <div className="min-h-screen bg-slate-100 flex">

        <AdminSidebar current="departments" />

        <main className="ml-64 flex-1 min-w-0">

          <div className="flex min-h-[300px] items-center justify-center">

            <p className="text-sm text-slate-500">
              Loading departments...
            </p>

          </div>

        </main>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-slate-100 flex">

      <AdminSidebar current="departments" />

      <main className="ml-64 flex-1 min-w-0">

      <div className="p-6">


      {/* Header */}

      <div className="mb-8">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Department Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage university departments and their codes
              </p>

            </div>

            </div>


          {/* Total Departments */}

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Departments
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {departments.length}
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


      {/* Department Form */}

      {showForm && (

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">


          <div className="mb-6">

            <h2 className="text-lg font-semibold text-slate-900">

              {editingId
                ? "Edit Department"
                : "Add New Department"}

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              {editingId
                ? "Update the department information."
                : "Create a new university department."}

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >


            {/* Department Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department Name
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


            {/* Department Code */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Department Code
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


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Department"
                  : "Add Department"}

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


      {/* Department List */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Departments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage university departments
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
              placeholder="Search departments..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-72"
            />


            {/* Add Button */}

            {!showForm && (

              <button
                type="button"
                onClick={handleAdd}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Add Department
              </button>

            )}

          </div>

        </div>


        {/* Department Table */}

        {filteredDepartments.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-700">
              No departments found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new department.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Code
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department ID
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredDepartments.map(
                  (department) => (

                    <tr
                      key={department.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >


                      {/* Department */}

                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-900">
                          {department.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          University Department
                        </p>

                      </td>


                      {/* Code */}

                      <td className="px-6 py-4">

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                          {department.code}
                        </span>

                      </td>


                      {/* ID */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-500">
                          {department.id}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                department
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
                                department.id
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

      </main>

    </div>

  );

}


export default Departments;