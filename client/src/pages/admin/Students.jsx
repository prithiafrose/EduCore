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
    dateOfBirth: "",
    guardianName: "",
    guardianPhone: "",
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
      dateOfBirth: "",
      guardianName: "",
      guardianPhone: "",
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
          formData.programId,
          formData.dateOfBirth || null,
          formData.guardianName || null,
          formData.guardianPhone || null
        );

        setSuccess("Student updated successfully.");
      } else {
        await createStudent(
          formData.studentId,
          formData.name,
          formData.email,
          formData.programId,
          formData.password,
          formData.dateOfBirth || null,
          formData.guardianName || null,
          formData.guardianPhone || null
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
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.slice(0, 10)
        : "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
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
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Student Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage student profiles and accounts
              </p>
            </div>

            </div>

          <div className="rounded-xl bg-white/[0.03] px-4 py-3 shadow-sm ring-1 ring-white/10">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Students
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {students.length}
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
      <div className="mb-8 rounded-2xl bg-white/[0.03] p-6 shadow-sm ring-1 ring-white/10">

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
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
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Student ID
            </label>

            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g. 2023001"
              required
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student's name"
              required
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              University Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@university.edu"
              required
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Program */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Academic Program
            </label>

            <select
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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


          {/* Date of Birth */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Guardian Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Guardian Name
            </label>

            <input
              type="text"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              placeholder="Enter guardian's name"
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Guardian Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Guardian Phone
            </label>

            <input
              type="text"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={handleChange}
              placeholder="Enter guardian's phone"
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>


          {/* Password */}
          {!editingId && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create login password"
                required
                className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-500">
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
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>


      {/* Student List */}
      <div className="rounded-2xl bg-white/[0.03] shadow-sm ring-1 ring-white/10">

        {/* List Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-semibold text-white">
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
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

            <p className="font-medium text-slate-200">
              No students found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new student.
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b border-white/10 bg-white/5">

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

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DOB
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Guardian
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Guardian Phone
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
                    className="border-b border-white/5 last:border-0 hover:bg-white/5"
                  >

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">
                        {student.studentId}
                      </span>
                    </td>


                    <td className="px-6 py-4">

                      <p className="font-medium text-white">
                        {student.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        User ID: {student.userId}
                      </p>

                    </td>


                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.email}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.program?.name || "—"}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.guardianName || "—"}
                    </td>


                    <td className="px-6 py-4 text-sm text-slate-300">
                      {student.guardianPhone || "—"}
                    </td>


                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(student)
                          }
                          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(student.id)
                          }
                          className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
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
