import { useEffect, useState } from "react";

import { getStudentByUserId } from "../../services/studentApi";
import { updateStudent } from "../../services/studentApi";
import api from "../../services/axios";

const Profile = () => {
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
  });

  // Change password state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] =
    useState(false);
  const [passwordError, setPasswordError] =
    useState("");
  const [passwordSuccess, setPasswordSuccess] =
    useState("");

  // ==============================
  // LOAD STUDENT PROFILE
  // ==============================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!storedUser?.id) {
          setError(
            "User information not found. Please login again."
          );
          return;
        }

        const currentStudent = await getStudentByUserId(
          storedUser.id
        );

        if (!currentStudent) {
          setError("Student profile not found.");
          return;
        }

        setStudent(currentStudent);

        setFormData({
          studentId:
            currentStudent.studentId || "",
          name: currentStudent.name || "",
          email: currentStudent.email || "",
        });
      } catch (error) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
            "Failed to load student profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==============================
  // HANDLE PROFILE INPUT
  // ==============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ==============================
  // START EDIT
  // ==============================

  const handleEdit = () => {
    setFormData({
      studentId: student?.studentId || "",
      name: student?.name || "",
      email: student?.email || "",
    });

    setEditing(true);
    setSuccess("");
    setError("");
  };

  // ==============================
  // CANCEL EDIT
  // ==============================

  const handleCancel = () => {
    setFormData({
      studentId: student?.studentId || "",
      name: student?.name || "",
      email: student?.email || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  // ==============================
  // SAVE PROFILE
  // ==============================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!student?.id) {
      setError("Student information is missing.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateStudent(
        student.id,
        formData.studentId.trim(),
        formData.name.trim(),
        formData.email.trim(),
        student.programId
      );

      const updatedStudent =
        response?.student || response;

      setStudent(updatedStudent);

      setFormData({
        studentId:
          updatedStudent.studentId || "",
        name: updatedStudent.name || "",
        email: updatedStudent.email || "",
      });

      // Update stored user email
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (storedUser) {
        const updatedUser = {
          ...storedUser,
          email: updatedStudent.email,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // HANDLE PASSWORD INPUT
  // ==============================

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess("");
  };

  // ==============================
  // CHANGE PASSWORD
  // ==============================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword) {
      setPasswordError("Old password is required.");
      return;
    }

    if (!passwordForm.newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!storedUser?.id) {
      setPasswordError("User information not found.");
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordError("");
      setPasswordSuccess("");

      const response = await api.post(
        "/auth/change-password",
        {
          userId: storedUser.id,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }
      );

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess(
        response?.data?.message ||
          "Password changed successfully."
      );
    } catch (error) {
      console.error(error);

      setPasswordError(
        error?.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
          <div className="text-slate-300 text-lg">
            Loading profile...
          </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error && !student) {
    return (
          <div className="mt-6 bg-white/[0.03] rounded-xl shadow-sm border border-red-500/20 p-6">
            <p className="text-red-400">{error}</p>
          </div>
    );
  }

  // ==============================
  // PROFILE
  // ==============================

  return (
        <>
          <div className="bg-white/[0.03] border-b">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-slate-100 mt-4">
              My Profile
            </h1>

            <p className="text-slate-400 mt-1">
              View and manage your student profile
            </p>
          </div>
        </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/[0.03] rounded-2xl shadow-sm border overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 px-8 py-8">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-400">
                  {student?.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {student?.name}
                </h2>

                <p className="text-blue-100 mt-1">
                  Student
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Title + Edit Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-100">
                Personal Information
              </h3>

              {!editing && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* View Mode */}
            {!editing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Full Name
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.name || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Email
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.email || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Student ID
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.studentId || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Program
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.program?.name || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Date of Birth
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.dateOfBirth
                      ? new Date(
                          student.dateOfBirth
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Guardian Name
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.guardianName || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Guardian Phone
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.guardianPhone || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    User ID
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.userId || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Account Created
                  </label>

                  <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                    {student?.createdAt
                      ? new Date(
                          student.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editing && (
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Student ID
                    </label>

                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your student ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Program
                    </label>

                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-300">
                      {student?.program?.name ||
                        "N/A"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-5 py-2.5 border border-white/15 text-slate-200 rounded-lg hover:bg-white/5 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {/* Account Information */}
            {!editing && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Account Information
                </h3>

                <div className="flex items-center justify-between border rounded-lg px-4 py-4 bg-white/5">
                  <div>
                    <p className="font-medium text-slate-100">
                      Account Role
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Your account has student access
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-300">
                    STUDENT
                  </span>
                </div>
              </div>
            )}

            {/* Change Password */}
            {!editing && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Change Password
                </h3>

                {passwordError && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-lg">
                    {passwordSuccess}
                  </div>
                )}

                <form
                  onSubmit={handleChangePassword}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={
                        passwordForm.confirmPassword
                      }
                      onChange={handlePasswordChange}
                      className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Re-enter new password"
                    />
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-white/10 transition disabled:opacity-50"
                    >
                      {passwordSaving
                        ? "Changing..."
                        : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;