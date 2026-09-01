const userService =
    require("../services/user.service");


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
            role
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
                role
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
            role
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
                role
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


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};