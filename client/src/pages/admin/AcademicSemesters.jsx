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

  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [semesterData, programData] = await Promise.all([
        getAcademicSemesters(),
        getPrograms(),
      ]);

      setSemesters(semesterData);
      setPrograms(programData);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load academic semesters");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      if (editingId !== null) {
        await updateAcademicSemester(
          editingId,
          name,
          order,
          programId
        );
      } else {
        await createAcademicSemester(
          name,
          order,
          programId
        );
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (editingId !== null) {
        setError("Failed to update academic semester");
      } else {
        setError("Failed to create academic semester");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (semester) => {
    console.log("Edit clicked:", semester);

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

    setShowForm(true);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this academic semester?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteAcademicSemester(id);
      await fetchData();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to delete academic semester");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setOrder("");
    setProgramId("");

    setEditingId(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
    setError("");
  };

  const handleProgramChange = (value) => {
    setProgramId(value);

    if (editingId === null && value) {
      const selectedProgram = programs.find(
        (program) => String(program.id) === String(value)
      );

      if (selectedProgram) {
        setOrder("");
      }
    }
  };

  const getProgramLimit = () => {
    if (!programId) {
      return null;
    }

    const selectedProgram = programs.find(
      (program) => String(program.id) === String(programId)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-gray-600">
          Loading academic semesters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Academic Semesters
        </h1>

        <p className="text-gray-500 mt-2">
          Manage academic semesters for university programs.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Academic Semester List
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
            {showForm ? "Cancel" : "Add Semester"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-50 p-6 rounded-lg mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-5">
              {editingId !== null
                ? "Edit Academic Semester"
                : "Add New Academic Semester"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="1st Semester"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Order
                </label>

                <input
                  type="number"
                  min="1"
                  max={getProgramLimit() || undefined}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="1"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />

                {getProgramLimit() && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: {getProgramLimit()} semesters
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program
                </label>

                <select
                  value={programId || ""}
                  onChange={(e) =>
                    handleProgramChange(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                  required
                >
                  <option value="">
                    Select Program
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={String(program.id)}
                    >
                      {program.name} ({program.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                  ? "Update Semester"
                  : "Create Semester"}
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Order</th>
                <th className="py-3 px-2">Program</th>
                <th className="py-3 px-2">Program Code</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {semesters.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-500"
                  >
                    No academic semesters found.
                  </td>
                </tr>
              ) : (
                semesters.map((semester) => (
                  <tr
                    key={semester.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-2">
                      {semester.id}
                    </td>

                    <td className="py-3 px-2 font-medium">
                      {semester.name}
                    </td>

                    <td className="py-3 px-2">
                      {semester.order}
                    </td>

                    <td className="py-3 px-2">
                      {semester.program?.name || "-"}
                    </td>

                    <td className="py-3 px-2">
                      {semester.program?.code || "-"}
                    </td>

                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(semester)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(semester.id)
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

export default AcademicSemesters;