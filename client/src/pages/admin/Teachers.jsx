import { useEffect, useState } from "react";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacherApi";

import { getDepartments } from "../../services/departmentApi";


const Teachers = () => {

  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);

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
    designation: "",
    departmentId: "",
  });


  // Load teachers
  const loadData = async () => {
    try {

      setLoading(true);
      setError("");

      const [teachersData, departmentsData] =
        await Promise.all([
          getTeachers(),
          getDepartments(),
        ]);

      setTeachers(teachersData);

      const deptList = Array.isArray(departmentsData)
        ? departmentsData
        : departmentsData?.data || [];

      setDepartments(deptList);

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
      designation: "",
      departmentId: "",
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
          {
            name: formData.name,
            email: formData.email,
            employeeId: formData.employeeId,
            userId: teacher?.userId,
            designation: formData.designation || null,
            departmentId: formData.departmentId
              ? Number(formData.departmentId)
              : null,
          }
        );

        setSuccess("Teacher updated successfully.");

      } else {

        await createTeacher({
          name: formData.name,
          email: formData.email,
          employeeId: formData.employeeId,
          password: formData.password,
          designation: formData.designation || null,
          departmentId: formData.departmentId
            ? Number(formData.departmentId)
            : null,
        });

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
      designation: teacher.designation || "",
      departmentId: teacher.department?.id
        ? String(teacher.department.id)
        : "",
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

    <div className="p-6">


      {/* Header */}

      <div className="mb-8">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold text-white">
                Teacher Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage teacher profiles and accounts
              </p>

            </div>

            </div>


          {/* Total Teachers */}

          <div className="rounded-xl bg-white/[0.03] px-4 py-3 shadow-sm ring-1 ring-white/10">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total Teachers
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {teachers.length}
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


      {/* Teacher Form */}

      <div className="mb-8 rounded-2xl bg-white/[0.03] p-6 shadow-sm ring-1 ring-white/10">


        <div className="mb-6">

          <h2 className="text-lg font-semibold text-white">

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

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter teacher's name"
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
              placeholder="teacher@university.edu"
              required
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          {/* Employee ID */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Employee ID
            </label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="e.g. EMP-001"
              required
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          {/* Designation */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Designation
            </label>

            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Professor"
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          {/* Department */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-200">
              Department
            </label>

            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >

              <option value="">
                Select a department
              </option>

              {departments.map(
                (dept) => (

                  <option
                    key={dept.id}
                    value={String(dept.id)}
                  >
                    {dept.name}
                  </option>

                )
              )}

            </select>

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
                className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* Teacher List */}

      <div className="rounded-2xl bg-white/[0.03] shadow-sm ring-1 ring-white/10">


        {/* List Header */}

        <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-semibold text-white">
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
              className="w-full rounded-xl border border-white/15 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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

            <p className="font-medium text-slate-200">
              No teachers found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search or add a new teacher.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-white/10 bg-white/5">

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
                    Designation
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

                {filteredTeachers.map((teacher) => (

                  <tr
                    key={teacher.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5"
                  >


                    {/* Employee ID */}

                    <td className="px-6 py-4">

                      <span className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-300">
                        {teacher.employeeId}
                      </span>

                    </td>


                    {/* Teacher */}

                    <td className="px-6 py-4">

                      <p className="font-medium text-white">
                        {teacher.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Teacher ID: {teacher.id}
                      </p>

                    </td>


                    {/* Email */}

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {teacher.email}
                    </td>


                    {/* Designation */}

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {teacher.designation || "—"}
                    </td>


                    {/* Department */}

                    <td className="px-6 py-4 text-sm text-slate-300">
                      {teacher.department?.name || "—"}
                    </td>


                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(teacher)}
                          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/5"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(teacher.id)}
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

};


export default Teachers;
