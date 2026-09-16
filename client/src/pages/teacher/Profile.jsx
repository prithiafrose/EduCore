import { useEffect, useState } from "react";

import api from "../../services/axios";

import {
    getAllTeachers,
    updateTeacher
} from "../../services/teacherApi";

import {
    updateProfile
} from "../../services/authApi";

import AvatarUploader
    from "../../components/ui/AvatarUploader";


const Profile = () => {

    const [teacher, setTeacher] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [editing, setEditing] = useState(false);

    const [saving, setSaving] = useState(false);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        employeeId: ""
    });


    // Avatar state

    const [avatarUrl, setAvatarUrl] = useState("");

    const [avatarSaving, setAvatarSaving] = useState(false);


    // Password form state

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordError, setPasswordError] = useState("");

    const [passwordSuccess, setPasswordSuccess] =
        useState("");

    const [passwordSaving, setPasswordSaving] =
        useState(false);


    // ==============================
    // LOAD TEACHER PROFILE
    // ==============================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);
                setError("");


                const storedUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    );


                if (!storedUser?.id) {

                    setError(
                        "User information not found. Please login again."
                    );

                    return;
                }


                const response =
                    await getAllTeachers();


                const teachers =
                    Array.isArray(response)
                        ? response
                        : [];


                // Find teacher using User ID
                const currentTeacher =
                    teachers.find(
                        (item) =>
                            Number(item.userId) ===
                            Number(storedUser.id)
                    );


                if (!currentTeacher) {

                    setError(
                        "Teacher profile not found."
                    );

                    return;
                }


                setTeacher(currentTeacher);


                setAvatarUrl(
                    storedUser?.avatarUrl || ""
                );


                setFormData({
                    name: currentTeacher.name || "",
                    email: currentTeacher.email || "",
                    employeeId:
                        currentTeacher.employeeId || ""
                });

            } catch (error) {

                console.error(error);

                setError(
                    error?.response?.data?.message ||
                    "Failed to load teacher profile."
                );

            } finally {

                setLoading(false);
            }
        };


        loadProfile();

    }, []);


    // ==============================
    // HANDLE INPUT
    // ==============================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));


        setSuccess("");
        setError("");
    };


    // ==============================
    // START EDIT
    // ==============================

    const handleEdit = () => {

        setFormData({
            name: teacher?.name || "",
            email: teacher?.email || "",
            employeeId:
                teacher?.employeeId || ""
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
            name: teacher?.name || "",
            email: teacher?.email || "",
            employeeId:
                teacher?.employeeId || ""
        });

        setEditing(false);

        setError("");
        setSuccess("");
    };


    // ==============================
    // PROFILE PICTURE
    // ==============================

    const handleAvatarSelect = async (dataUrl) => {

        try {

            setAvatarSaving(true);

            setSuccess("");
            setError("");


            const response =
                await updateProfile({
                    avatarUrl: dataUrl
                });


            const updatedUser =
                response?.data?.user || {};


            const storedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (storedUser) {

                const updatedUserData = {
                    ...storedUser,
                    avatarUrl:
                        updatedUser.avatarUrl ||
                        dataUrl || null
                };


                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUserData)
                );
            }


            setAvatarUrl(
                updatedUser.avatarUrl ||
                dataUrl || ""
            );


            setSuccess(
                dataUrl
                    ? "Profile picture updated successfully."
                    : "Profile picture removed."
            );

        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to update profile picture."
            );

        } finally {

            setAvatarSaving(false);
        }
    };


    // ==============================
    // SAVE PROFILE
    // ==============================

    const handleSave = async (event) => {

        event.preventDefault();


        // Frontend validation
        if (!formData.name.trim()) {

            setError("Name is required.");
            return;
        }


        if (!formData.email.trim()) {

            setError("Email is required.");
            return;
        }


        if (!formData.employeeId.trim()) {

            setError("Employee ID is required.");
            return;
        }


        if (!teacher?.id) {

            setError(
                "Teacher information is missing."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");
            setSuccess("");


            const response =
                await updateTeacher(
                    teacher.id,
                    {
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        employeeId:
                            formData.employeeId.trim()
                    }
                );


            // Backend returns:
            // {
            //   message: "...",
            //   teacher: {...}
            // }

            const updatedTeacher =
                response?.teacher || response;


            setTeacher(updatedTeacher);


            setFormData({
                name: updatedTeacher.name || "",
                email: updatedTeacher.email || "",
                employeeId:
                    updatedTeacher.employeeId || ""
            });


            // Update stored user email
            // because login user contains email
            const storedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (storedUser) {

                const updatedUser = {
                    ...storedUser,
                    email: updatedTeacher.email
                };


                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
            }


            setEditing(false);

            setSuccess(
                "Profile updated successfully."
            );

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

        const {
            name,
            value
        } = event.target;


        setPasswordForm((previous) => ({
            ...previous,
            [name]: value
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


        const storedUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        if (!storedUser?.id) {

            setPasswordError(
                "User information not found."
            );

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
                    oldPassword:
                        passwordForm.oldPassword,
                    newPassword:
                        passwordForm.newPassword
                }
            );


            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
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
            <div className="p-8">

                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-10 text-center text-slate-500">
                    Loading profile...
                </div>

            </div>
        );
    }


    // ==============================
    // ERROR
    // ==============================

    if (error && !teacher) {

        return (
            <div className="p-8">

                <div className="max-w-5xl mx-auto mt-6 bg-white/[0.03] rounded-xl shadow-sm border border-red-500/20 p-6">

                    <p className="text-red-400">

                        {error}
                    </p>

                </div>

            </div>
        );
    }


    // ==============================
    // PROFILE
    // ==============================

    return (
        <>

            {/* ==============================
                HEADER
            ============================== */}

            <div className="bg-white/[0.03] border-b">

                <div className="px-8 py-6">

                    <h1 className="text-3xl font-bold text-slate-100 mt-4">
                        My Profile
                    </h1>


                    <p className="text-slate-400 mt-1">
                        View and manage your teacher profile
                    </p>

                </div>

            </div>


            {/* ==============================
                CONTENT
            ============================== */}

            <div className="max-w-5xl mx-auto px-6 py-8">

                <div className="bg-white/[0.03] rounded-2xl shadow-sm border overflow-hidden">


                    {/* ==============================
                        PROFILE HEADER
                    ============================== */}

                    <div className="bg-blue-600 px-8 py-8">

                        <div className="flex items-center gap-5">


                            {/* Avatar */}

                            <AvatarUploader
                                size="md"
                                avatarUrl={avatarUrl}
                                name={teacher?.name || ""}
                                busy={avatarSaving}
                                onSelect={handleAvatarSelect}
                                onError={setError}
                            />


                            {/* Name */}

                            <div>

                                <h2 className="text-2xl font-bold text-white">

                                    {teacher?.name}

                                </h2>


                                <p className="text-blue-100 mt-1">

                                    Teacher

                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==============================
                        PROFILE BODY
                    ============================== */}

                    <div className="p-8">


                        {/* Messages */}

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


                        {/* ==============================
                            TITLE + EDIT BUTTON
                        ============================== */}

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


                        {/* ==============================
                            VIEW MODE
                        ============================== */}

                        {!editing && (

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                {/* Name */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Full Name
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.name || "N/A"}
                                    </div>

                                </div>


                                {/* Email */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Email
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.email || "N/A"}
                                    </div>

                                </div>


                                {/* Employee ID */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Employee ID
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.employeeId || "N/A"}
                                    </div>

                                </div>


                                {/* Designation */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Designation
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.designation || "N/A"}
                                    </div>

                                </div>


                                {/* Department */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Department
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.department?.name || "N/A"}
                                    </div>

                                </div>


                                {/* Teacher ID */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Teacher ID
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.id || "N/A"}
                                    </div>

                                </div>


                                {/* User ID */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        User ID
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">
                                        {teacher?.userId || "N/A"}
                                    </div>

                                </div>


                                {/* Created At */}

                                <div>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Account Created
                                    </label>

                                    <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-100">

                                        {teacher?.createdAt
                                            ? new Date(
                                                teacher.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"}

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* ==============================
                            EDIT MODE
                        ============================== */}

                        {editing && (

                            <form
                                onSubmit={handleSave}
                            >

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                    {/* Name */}

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


                                    {/* Email */}

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


                                    {/* Employee ID */}

                                    <div>

                                        <label className="block text-sm font-medium text-slate-200 mb-2">

                                            Employee ID

                                        </label>


                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter your employee ID"
                                        />

                                    </div>


                                    {/* Teacher ID */}

                                    <div>

                                        <label className="block text-sm font-medium text-slate-400 mb-2">

                                            Teacher ID

                                        </label>


                                        <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-300">

                                            {teacher?.id}

                                        </div>

                                    </div>


                                    {/* User ID */}

                                    <div>

                                        <label className="block text-sm font-medium text-slate-400 mb-2">

                                            User ID

                                        </label>


                                        <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-300">

                                            {teacher?.userId}

                                        </div>

                                    </div>


                                    {/* Role */}

                                    <div>

                                        <label className="block text-sm font-medium text-slate-400 mb-2">

                                            Role

                                        </label>


                                        <div className="border rounded-lg px-4 py-3 bg-white/5 text-slate-300">

                                            TEACHER

                                        </div>

                                    </div>

                                </div>


                                {/* Buttons */}

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


                        {/* ==============================
                            ACCOUNT INFORMATION
                        ============================== */}

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

                                            Your account has teacher access

                                        </p>

                                    </div>


                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-300">

                                        TEACHER

                                    </span>

                                </div>

                            </div>

                        )}


                        {/* ==============================
                            CHANGE PASSWORD
                        ============================== */}

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
                                            value={passwordForm.confirmPassword}
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