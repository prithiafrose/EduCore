import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../services/studentApi";
import { getPrograms } from "../../services/programApi";

function Students() {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
    programId: "",
    password: "",
  });

  // Load students and programs
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, programsData] = await Promise.all([
        getStudents(),
        getPrograms(),
      ]);

      setStudents(studentsData);
      setPrograms(programsData);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      studentId: "",
      name: "",
      email: "",
      programId: "",
      password: "",
    });

    setEditingId(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateStudent(
          editingId,
          formData.studentId,
          formData.name,
          formData.email,
          formData.programId
        );

        setSuccess("Student updated successfully.");
      } else {
        await createStudent(
          formData.studentId,
          formData.name,
          formData.email,
          formData.programId,
          formData.password
        );

        setSuccess("Student created successfully.");
      }

      resetForm();
      await loadData();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save student"
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingId(student.id);

    setFormData({
      studentId: student.studentId || "",
      name: student.name || "",
      email: student.email || "",
      programId: student.programId
        ? String(student.programId)
        : "",
      password: "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteStudent(id);

      setSuccess("Student deleted successfully.");

      await loadData();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete student"
      );
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.studentId
        ?.toLowerCase()
        .includes(searchText) ||
      student.name
        ?.toLowerCase()
        .includes(searchText) ||
      student.email
        ?.toLowerCase()
        .includes(searchText) ||
      student.program?.name
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Student Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage student profiles and accounts
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Students
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {students.length}
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
      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId
              ? "Edit Student"
              : "Add New Student"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? "Update the student's information."
              : "Create a student account and profile."}
          </p>
        </div>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >

          {/* Student ID */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Student ID
            </label>

            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 2023001"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's name"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              University Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Program */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Academic Program
            </label>

            <select
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                Select a program
              </option>

              {programs.map((program) => (
                <option
                  key={program.id}
                  value={program.id}
                >
                  {program.name}
                </option>
              ))}
            </select>
          </div>


          {/* Password */}
          {!editingId && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create login password"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                This password will be used by the student to
                sign in to EduCore.
              </p>
            </div>
          )}


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
                ? "Update Student"
                : "Add Student"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>


      {/* Student List */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

        {/* List Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered students
            </p>
          </div>

          {/* Search */}
          <div className="w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search students..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

        </div>


        {/* Loading */}
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center">

            <p className="font-medium text-slate-700">
              No students found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new student.
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Student
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
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

                {filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                        {student.studentId}
                      </span>
                    </td>


                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-900">
                        {student.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        User ID: {student.userId}
                      </p>

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.email}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.program?.name || "—"}
                    </td>


                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(student)
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(student.id)
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
  );
}

export default Students;