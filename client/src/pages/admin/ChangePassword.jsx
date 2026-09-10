import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

import { changePassword } from "../../services/authApi";


const ChangePassword = () => {

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Clear form
  const clearForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };


  // Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {

      await changePassword(
        currentUser?.id,
        oldPassword,
        newPassword
      );

      setSuccess("Password changed successfully.");

      clearForm();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to change password"
      );

    }

  };


  return (
    <div className="min-h-screen bg-slate-100 flex">

      <AdminSidebar current="change-password" />

      <main className="ml-64 flex-1 min-w-0">

      <div className="p-6">

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold mb-6">
          Change Password
        </h1>

      </div>


      {/* Messages */}

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {success}
        </div>
      )}


      {/* Form */}

      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-lg font-semibold mb-4">
          Update Your Password
        </h2>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* Old Password */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>


          {/* New Password */}

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>


          {/* Confirm New Password */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>


          {/* Buttons */}

          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Change Password
            </button>


            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>

          </div>

        </form>

      </div>

      </div>

      </main>

    </div>
  );
};


export default ChangePassword;
