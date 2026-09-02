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

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [programType, setProgramType] = useState("BACHELOR");
  const [durationYears, setDurationYears] = useState("");
  const [totalSemesters, setTotalSemesters] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [programData, departmentData] = await Promise.all([
        getPrograms(),
        getDepartments(),
      ]);

      setPrograms(programData);
      setDepartments(departmentData);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load programs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
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
      } else {
        await createProgram(
          name,
          code,
          programType,
          durationYears,
          totalSemesters,
          departmentId
        );
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (editingId !== null) {
        setError("Failed to update program");
      } else {
        setError("Failed to create program");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (program) => {
    console.log("Edit clicked:", program);

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

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this program?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteProgram(id);
      await fetchData();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to delete program");
      }
    }
  };

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

  const handleCancel = () => {
    resetForm();
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-gray-600">
          Loading programs...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Programs
        </h1>

        <p className="text-gray-500 mt-2">
          Manage university academic programs.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Program List
          </h2>

          <button
            type="button"
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
            {showForm ? "Cancel" : "Add Program"}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 p-6 rounded-lg mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              {editingId !== null
                ? "Edit Program"
                : "Add New Program"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Software Engineering"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Code
                </label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  placeholder="SWE"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Program Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Type
                </label>

                <select
                  value={programType || "BACHELOR"}
                  onChange={(e) =>
                    handleProgramTypeChange(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  required
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>

                <select
                  value={departmentId || ""}
                  onChange={(e) =>
                    setDepartmentId(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  required
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.id}
                      value={String(department.id)}
                    >
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Years)
                </label>

                <input
                  type="number"
                  min="1"
                  value={durationYears}
                  onChange={(e) =>
                    setDurationYears(e.target.value)
                  }
                  placeholder="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* Semesters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Semesters
                </label>

                <input
                  type="number"
                  min="1"
                  value={totalSemesters}
                  onChange={(e) =>
                    setTotalSemesters(e.target.value)
                  }
                  placeholder="8"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving
                  ? editingId !== null
                    ? "Updating..."
                    : "Creating..."
                  : editingId !== null
                  ? "Update Program"
                  : "Create Program"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

            </div>
          </form>
        )}

        {/* Program Table */}
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b text-left">

                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Code</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Duration</th>
                <th className="py-3 px-2">Semesters</th>
                <th className="py-3 px-2">Department</th>
                <th className="py-3 px-2">Actions</th>

              </tr>
            </thead>

            <tbody>
              {programs.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-500"
                  >
                    No programs found.
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr
                    key={program.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      {program.id}
                    </td>

                    <td className="py-3 px-2 font-medium">
                      {program.name}
                    </td>

                    <td className="py-3 px-2">
                      {program.code}
                    </td>

                    <td className="py-3 px-2">
                      {program.programType || "-"}
                    </td>

                    <td className="py-3 px-2">
                      {program.durationYears
                        ? `${program.durationYears} years`
                        : "-"}
                    </td>

                    <td className="py-3 px-2">
                      {program.totalSemesters ?? "-"}
                    </td>

                    <td className="py-3 px-2">
                      {program.department?.name || "-"}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(program)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(program.id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default Programs;