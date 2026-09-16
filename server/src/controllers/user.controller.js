const userService =
    require("../services/user.service");

const {
    validateEmail
} = require("../utils/email");


// GET all users
const getAllUsers = async (req, res) => {
    try {

        const users =
            await userService.getAllUsers();

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};


// GET user by ID
const getUserById = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        const user =
            await userService.getUserById(id);


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.status(200).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch user"
        });
    }
};


// CREATE user
const createUser = async (req, res) => {
    try {

        const {
            email,
            password,
            role,
            isActive
        } = req.body;


        // Required fields
        if (
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message:
                    "email, password and role are required"
            });
        }


        // Validate email format (rejects invalid / disposable addresses)
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }


        // Validate role
        const validRoles = [
            "ADMIN",
            "TEACHER",
            "STUDENT"
        ];


        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message:
                    "Invalid role. Use ADMIN, TEACHER or STUDENT"
            });
        }


        const user =
            await userService.createUser(
                email,
                password,
                role,
                isActive !== undefined
                    ? Boolean(isActive)
                    : true
            );


        res.status(201).json(user);

    } catch (error) {

        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "A user with this email already exists"
            });
        }


        res.status(500).json({
            message: "Failed to create user"
        });
    }
};


// UPDATE user
const updateUser = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            email,
            password,
            role,
            isActive
        } = req.body;


        // Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        // Email and role are required
        // Password is optional
        if (
            !email ||
            !role
        ) {
            return res.status(400).json({
                message:
                    "email and role are required"
            });
        }


        // Validate email format (rejects invalid / disposable addresses)
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({
                message: emailError
            });
        }


        // Validate role
        const validRoles = [
            "ADMIN",
            "TEACHER",
            "STUDENT"
        ];


        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message:
                    "Invalid role. Use ADMIN, TEACHER or STUDENT"
            });
        }


        // Check user exists
        const existingUser =
            await userService.getUserById(id);


        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        const user =
            await userService.updateUser(
                id,
                email,
                password,
                role,
                isActive
            );


        res.status(200).json(user);

    } catch (error) {

        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "A user with this email already exists"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.status(500).json({
            message: "Failed to update user"
        });
    }
};


// DELETE user
const deleteUser = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        const existingUser =
            await userService.getUserById(id);


        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        await userService.deleteUser(id);


        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {

        console.error(error);


        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete user because related records exist"
            });
        }


        res.status(500).json({
            message: "Failed to delete user"
        });
    }
};


// SET user active status
const setUserActive = async (req, res) => {
    try {

        const { id } = req.params;

        const { isActive } = req.body;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                message: "isActive must be a boolean"
            });
        }


        const user =
            await userService.setUserActive(
                id,
                isActive
            );


        res.status(200).json(user);

    } catch (error) {

        console.error(error);


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.status(500).json({
            message: "Failed to update user status"
        });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setUserActive
};