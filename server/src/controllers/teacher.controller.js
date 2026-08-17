const teacherService =
    require("../services/teacher.service");


// GET all teachers
const getAllTeachers = async (req, res) => {
    try {

        const teachers =
            await teacherService.getAllTeachers();

        res.status(200).json(teachers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch teachers"
        });
    }
};


// GET teacher by ID
const getTeacherById = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher ID"
            });
        }

        const teacher =
            await teacherService.getTeacherById(id);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }

        res.status(200).json(teacher);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch teacher"
        });
    }
};


// CREATE teacher
const createTeacher = async (req, res) => {
    try {

        const {
            name,
            email,
            employeeId,
            userId
        } = req.body;


        // Required fields
        if (
            !name ||
            !email ||
            !employeeId ||
            userId === undefined
        ) {
            return res.status(400).json({
                message:
                    "name, email, employeeId and userId are required"
            });
        }


        // Validate userId
        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        const teacher =
            await teacherService.createTeacher(
                name,
                email,
                employeeId,
                userId
            );


        res.status(201).json(teacher);

    } catch (error) {

        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "Teacher email, employee ID or user ID already exists"
            });
        }


        if (error.code === "P2003") {
            return res.status(404).json({
                message: "User not found"
            });
        }


        res.status(500).json({
            message: "Failed to create teacher"
        });
    }
};


// UPDATE teacher
const updateTeacher = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            name,
            email,
            employeeId,
            userId
        } = req.body;


        // Validate teacher ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher ID"
            });
        }


        // Required fields
        if (
            !name ||
            !email ||
            !employeeId ||
            userId === undefined
        ) {
            return res.status(400).json({
                message:
                    "name, email, employeeId and userId are required"
            });
        }


        // Validate userId
        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }


        // Check teacher exists
        const existingTeacher =
            await teacherService.getTeacherById(id);

        if (!existingTeacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        const teacher =
            await teacherService.updateTeacher(
                id,
                name,
                email,
                employeeId,
                userId
            );


        res.status(200).json(teacher);

    } catch (error) {

        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "Teacher email, employee ID or user ID already exists"
            });
        }


        if (error.code === "P2003") {
            return res.status(404).json({
                message: "User not found"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(500).json({
            message: "Failed to update teacher"
        });
    }
};


// DELETE teacher
const deleteTeacher = async (req, res) => {
    try {

        const { id } = req.params;


        // Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher ID"
            });
        }


        // Check teacher exists
        const existingTeacher =
            await teacherService.getTeacherById(id);

        if (!existingTeacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        // Delete
        await teacherService.deleteTeacher(id);


        res.status(200).json({
            message: "Teacher deleted successfully"
        });

    } catch (error) {

        console.error(error);


        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete teacher because related records exist"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(500).json({
            message: "Failed to delete teacher"
        });
    }
};


module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};