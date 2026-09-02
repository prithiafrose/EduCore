import { useEffect, useState } from "react";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../../services/departmentApi";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setCreating(true);

    try {
      if (editingId) {
        await updateDepartment(editingId, name, code);
      } else {
        await createDepartment(name, code);
      }

      setName("");
      setCode("");
      setEditingId(null);
      setShowForm(false);

      await fetchDepartments();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          editingId
            ? "Failed to update department"
            : "Failed to create department"
        );
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteDepartment(id);

      await fetchDepartments();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to delete department");
      }
    }
  };

  const handleEdit = (department) => {
    setEditingId(department.id);
    setName(department.name);
    setCode(department.code);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setName("");
    setCode("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  if (loading) {
    return <p>Loading departments...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Departments
      </h1>

      <p className="text-gray-500 mt-2">
        Manage university departments.
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mt-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow mt-8 p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Department List
          </h2>

          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setShowForm(true);
                setError("");
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Department"}
          </button>
        </div>

        {/* Add / Edit Department Form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-gray-50 p-5 rounded-lg mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editingId
                ? "Edit Department"
                : "Add New Department"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Department Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Software Engineering"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department Code
                </label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SWE"
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={creating}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {creating
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                ? "Update Department"
                : "Create Department"}
            </button>
          </form>
        )}

        {/* Department Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">ID</th>
              <th className="py-3">Name</th>
              <th className="py-3">Code</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr
                key={department.id}
                className="border-b"
              >
                <td className="py-3">
                  {department.id}
                </td>

                <td className="py-3">
                  {department.name}
                </td>

                <td className="py-3">
                  {department.code}
                </td>

                <td className="py-3 flex gap-2">

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(department)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() =>
                      handleDelete(department.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Departments;