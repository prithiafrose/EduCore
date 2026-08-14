const courseService = require("../services/course.service");


// GET all courses
const getAllCourses = async (req, res) => {
    try {
        const courses =
            await courseService.getAllCourses();

        res.status(200).json(courses);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};


// GET course by ID
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course =
            await courseService.getCourseById(id);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch course"
        });
    }
};


// CREATE course
const createCourse = async (req, res) => {
    try {
        const {
            code,
            name,
            credit,
            description
        } = req.body;


        // 1. Required fields
        if (
            !code ||
            !name ||
            credit === undefined ||
            credit === null
        ) {
            return res.status(400).json({
                message: "Code, name and credit are required"
            });
        }


        // 2. String validation
        if (
            typeof code !== "string" ||
            typeof name !== "string"
        ) {
            return res.status(400).json({
                message: "Code and name must be strings"
            });
        }


        // 3. Empty validation
        if (
            code.trim() === "" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                message: "Code and name cannot be empty"
            });
        }


        // 4. Credit validation
        const numericCredit = Number(credit);

        if (
            !Number.isFinite(numericCredit) ||
            numericCredit <= 0
        ) {
            return res.status(400).json({
                message: "Credit must be a positive number"
            });
        }


        // 5. Description validation
        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }


        // 6. Create course
        const course =
            await courseService.createCourse(
                code,
                name,
                numericCredit,
                description
            );


        res.status(201).json(course);

    } catch (error) {
        console.error(error);


        // Duplicate course code
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }


        res.status(500).json({
            message: "Failed to create course"
        });
    }
};


// UPDATE course
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            code,
            name,
            credit,
            description
        } = req.body;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // 2. Required fields
        if (
            !code ||
            !name ||
            credit === undefined ||
            credit === null
        ) {
            return res.status(400).json({
                message: "Code, name and credit are required"
            });
        }


        // 3. String validation
        if (
            typeof code !== "string" ||
            typeof name !== "string"
        ) {
            return res.status(400).json({
                message: "Code and name must be strings"
            });
        }


        // 4. Empty validation
        if (
            code.trim() === "" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                message: "Code and name cannot be empty"
            });
        }


        // 5. Credit validation
        const numericCredit = Number(credit);

        if (
            !Number.isFinite(numericCredit) ||
            numericCredit <= 0
        ) {
            return res.status(400).json({
                message: "Credit must be a positive number"
            });
        }


        // 6. Description validation
        if (
            description !== undefined &&
            description !== null &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                message: "Description must be a string"
            });
        }


        // 7. Check course exists
        const existingCourse =
            await courseService.getCourseById(id);

        if (!existingCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // 8. Update course
        const course =
            await courseService.updateCourse(
                id,
                code,
                name,
                numericCredit,
                description
            );


        res.status(200).json(course);

    } catch (error) {
        console.error(error);


        // Duplicate course code
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Course code already exists"
            });
        }


        // Course not found
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        res.status(500).json({
            message: "Failed to update course"
        });
    }
};


// DELETE course
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }


        // 2. Check course exists
        const existingCourse =
            await courseService.getCourseById(id);

        if (!existingCourse) {
            return res.status(404).json({
                message: "Course not found"
            });
        }


        // 3. Delete course
        await courseService.deleteCourse(id);


        res.status(200).json({
            message: "Course deleted successfully"
        });

    } catch (error) {
        console.error(error);


        // Course has related course offerings
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete course because it has related course offerings"
            });
        }


        res.status(500).json({
            message: "Failed to delete course"
        });
    }
};


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};