import { useEffect, useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";

import {
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../services/departmentApi";

import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";


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

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          </div>

    );

  }


  return (

      <div className="ec-page">

      {/* Header */}

      <PageHeader
        title="Departments"
        subtitle="Manage university departments and their codes."
        actions={[
          !showForm && (
            <button
              key="add"
              type="button"
              onClick={handleAdd}
              className="ec-btn ec-btn-primary"
            >
              <Plus size={16} />
              Add Department
            </button>
          ),
        ]}
      />


      {/* Messages */}

      {success && (

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>

      )}


      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>

      )}


      {/* Department Form */}

      {showForm && (

        <div className="ec-card ec-card-pad">

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

            <div className="ec-field md:mb-0">

              <label className="ec-label">
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
                className="ec-input"
              />

            </div>


            {/* Department Code */}

            <div className="ec-field md:mb-0">

              <label className="ec-label">
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
                className="ec-input uppercase"
              />

            </div>


            {/* Buttons */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="ec-btn ec-btn-primary"
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
                className="ec-btn ec-btn-secondary"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* Department List */}

      <div className="ec-card overflow-hidden">

        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Departments
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                View and manage university departments
              </p>

            </div>

            <span className="ec-badge ec-badge-indigo">
              {departments.length} total
            </span>

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
              className="ec-search"
            />

          </div>

        </div>


        {/* Department Table */}

        <DataTable
          columns={["Department", "Code", "Department ID", ""]}
          empty={
            filteredDepartments.length === 0 && (
              <EmptyState
                icon={Building2}
                title="No departments found"
                description="Try a different search or add a new department."
              />
            )
          }
        >

          {filteredDepartments.map(
            (department) => (

              <tr
                key={department.id}
              >


                {/* Department */}

                <td>

                  <p className="font-medium text-slate-900">
                    {department.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    University Department
                  </p>

                </td>


                {/* Code */}

                <td>

                  <span className="ec-badge ec-badge-indigo">
                    {department.code}
                  </span>

                </td>


                {/* ID */}

                <td>

                  <span className="text-sm text-slate-500">
                    {department.id}
                  </span>

                </td>


                {/* Actions */}

                <td>

                  <div className="flex justify-end gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          department
                        )
                      }
                      aria-label="Edit department"
                      className="ec-icon-btn"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          department.id
                        )
                      }
                      aria-label="Delete department"
                      className="ec-icon-btn ec-icon-btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </DataTable>

      </div>

      </div>

  );

}


export default Departments;