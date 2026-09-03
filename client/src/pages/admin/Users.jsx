import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userApi";


const Users = () => {

  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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
          role
        );

        setSuccess("User updated successfully.");

      } else {

        await createUser(
          email,
          password,
          role
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

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>


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
                  colSpan="5"
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