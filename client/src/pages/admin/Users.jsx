import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserActive,
} from "../../services/userApi";


const Users = () => {

  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load users
  const loadUsers = async () => {
    try {

      setError("");

      const data = await getUsers();

      setUsers(data);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to load users"
      );
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);


  // Clear form
  const clearForm = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setIsActive(true);
    setEditingId(null);
  };


  // Add / Update user
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      if (editingId) {

        await updateUser(
          editingId,
          email,
          password,
          role,
          isActive
        );

        setSuccess("User updated successfully.");

      } else {

        await createUser(
          email,
          password,
          role,
          isActive
        );

        setSuccess("User created successfully.");
      }

      clearForm();

      await loadUsers();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save user"
      );
    }
  };


  // Edit user
  const handleEdit = (user) => {

    setEditingId(user.id);

    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setIsActive(user.isActive !== false);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // Toggle active status
  const handleToggleActive = async (user) => {

    const newStatus = !user.isActive;

    if (!newStatus) {

      const confirmed = window.confirm(
        "Are you sure you want to deactivate this user?"
      );

      if (!confirmed) {
        return;
      }
    }

    setError("");
    setSuccess("");

    try {

      await setUserActive(user.id, newStatus);

      setSuccess(
        newStatus
          ? "User activated successfully."
          : "User deactivated successfully."
      );

      await loadUsers();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update user status"
      );
    }
  };


  // Delete user
  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {

      await deleteUser(id);

      setSuccess("User deleted successfully.");

      await loadUsers();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };


  return (
    <div className="p-6">

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold mb-6">
          User Management
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


      {/* User Form */}

      <div className="bg-white p-6 rounded-lg shadow mb-8">

        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit User" : "Add User"}
        </h2>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* Email */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>


          {/* Password */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
              {editingId && (
                <span className="text-gray-500 font-normal">
                  {" "} (leave blank to keep current password)
                </span>
              )}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                editingId
                  ? "Enter new password"
                  : "Enter password"
              }
              className="w-full border rounded px-3 py-2"
              required={!editingId}
            />
          </div>


          {/* Role */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >

              <option value="">
                Select role
              </option>

              <option value="ADMIN">
                ADMIN
              </option>

              <option value="TEACHER">
                TEACHER
              </option>

              <option value="STUDENT">
                STUDENT
              </option>

            </select>
          </div>


          {/* Active */}

          <div className="flex items-center gap-2 pt-6">

            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />

            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>

          </div>


          {/* Buttons */}

          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update User" : "Add User"}
            </button>


            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* Users Table */}

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">
                ID
              </th>

              <th className="px-4 py-3 text-left">
                Email
              </th>

              <th className="px-4 py-3 text-left">
                Role
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Created At
              </th>

              <th className="px-4 py-3 text-left">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t"
                >

                  <td className="px-4 py-3">
                    {user.id}
                  </td>

                  <td className="px-4 py-3">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    {user.role}
                  </td>

                  <td className="px-4 py-3">
                    {user.isActive !== false ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(user)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleToggleActive(user)
                        }
                        className={`px-3 py-1 rounded text-white ${
                          user.isActive !== false
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.isActive !== false
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

  );
};


export default Users;
