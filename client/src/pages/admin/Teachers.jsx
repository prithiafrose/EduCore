import { useEffect, useState } from "react";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacherApi";


const Teachers = () => {

  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
  });


  // Load teachers
  const loadData = async () => {
    try {

      setLoading(true);
      setError("");

      const teachersData = await getTeachers();

      setTeachers(teachersData);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load teacher data"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadData();
  }, []);


  // Handle input
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
      name: "",
      email: "",
      employeeId: "",
      password: "",
    });

    setEditingId(null);

  };


  // Add / Update teacher
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      setSaving(true);

      if (editingId) {

        const teacher = teachers.find(
          (teacher) => teacher.id === editingId
        );

        await updateTeacher(
          editingId,
          formData.name,
          formData.email,
          formData.employeeId,
          teacher?.userId
        );

        setSuccess("Teacher updated successfully.");

      } else {

        await createTeacher(
          formData.name,
          formData.email,
          formData.employeeId,
          formData.password
        );

        setSuccess("Teacher created successfully.");

      }

      resetForm();

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save teacher"
      );

    } finally {

      setSaving(false);

    }

  };


  // Edit teacher
  const handleEdit = (teacher) => {

    setEditingId(teacher.id);

    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      employeeId: teacher.employeeId || "",
      password: "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // Delete teacher
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {

      setError("");
      setSuccess("");

      await deleteTeacher(id);

      setSuccess("Teacher deleted successfully.");

      await loadData();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete teacher"
      );

    }

  };


  // Search
  const filteredTeachers = teachers.filter((teacher) => {

    const searchText = search.toLowerCase();

    return (
      teacher.name
        ?.toLowerCase()
        .includes(searchText) ||

      teacher.email
        ?.toLowerCase()
        .includes(searchText) ||

      teacher.employeeId
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
              Teacher Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage teacher profiles and accounts
            </p>

          </div>


          {/* Total Teachers */}

          <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Teachers
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {teachers.length}
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


      {/* Teacher Form */}

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">


        <div className="mb-6">

          <h2 className="text-lg font-semibold text-slate-900">

            {editingId
              ? "Edit Teacher"
              : "Add New Teacher"}

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            {editingId
              ? "Update the teacher's information."
              : "Create a teacher account and profile."}

          </p>

        </div>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >


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
              placeholder="Enter teacher's name"
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
              placeholder="teacher@university.edu"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          {/* Employee ID */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Employee ID
            </label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP-001"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          {/* Password */}

          {!editingId && (

            <div>

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
                This password will be used by the teacher to sign in to EduCore.
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
                ? "Update Teacher"
                : "Add Teacher"}

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


      {/* Teacher List */}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Teachers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered teachers
            </p>

          </div>


          {/* Search */}

          <div className="w-full sm:w-80">

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search teachers..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

        </div>


        {/* Loading */}

        {loading ? (

          <div className="p-10 text-center text-sm text-slate-500">
            Loading teachers...
          </div>

        ) : filteredTeachers.length === 0 ? (

          <div className="p-10 text-center">

            <p className="font-medium text-slate-700">
              No teachers found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Try a different search or add a new teacher.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Employee ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Teacher
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User ID
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >


                    {/* Employee ID */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                        {teacher.employeeId}
                      </span>

                    </td>


                    {/* Teacher */}

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-900">
                        {teacher.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Teacher ID: {teacher.id}
                      </p>

                    </td>


                    {/* Email */}

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {teacher.email}
                    </td>


                    {/* User ID */}

                    <td className="px-6 py-4">

                      <span className="text-sm text-slate-500">
                        {teacher.userId}
                      </span>

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(teacher)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(teacher.id)}
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

};


export default Teachers;