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


        // Validate teacher ID
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
            password,
            designation,
            departmentId
        } = req.body;


        // Validate required fields
        if (
            !name ||
            !email ||
            !employeeId ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Name, email, employeeId and password are required"
            });
        }


        const teacher =
            await teacherService.createTeacher(
                name,
                email,
                employeeId,
                password,
                designation,
                departmentId
            );


        res.status(201).json(teacher);

    } catch (error) {

        console.error(error);


        // Duplicate email or employee ID
        if (error.code === "P2002") {

            return res.status(409).json({
                message:
                    "Email or employee ID already exists"
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
            designation,
            departmentId
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


        // Validate required fields
        if (
            !name ||
            !email ||
            !employeeId
        ) {

            return res.status(400).json({
                message:
                    "Name, email and employeeId are required"
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


        // Update teacher
        const teacher =
            await teacherService.updateTeacher(
                id,
                name.trim(),
                email.trim(),
                employeeId.trim(),
                designation,
                departmentId
            );


        res.status(200).json({
            message: "Teacher profile updated successfully",
            teacher
        });

    } catch (error) {

        console.error(error);


        // Duplicate email or employee ID
        if (error.code === "P2002") {

            return res.status(409).json({
                message:
                    "Email or employee ID already exists"
            });
        }


        // Teacher not found
        if (error.code === "P2025") {

            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        res.status(500).json({
            message: "Failed to update teacher profile"
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


        // Delete teacher
        await teacherService.deleteTeacher(id);


        res.status(200).json({
            message: "Teacher deleted successfully"
        });

    } catch (error) {

        console.error(error);


        if (
            error.code === "P2003" ||
            error.code === "P2039"
        ) {

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