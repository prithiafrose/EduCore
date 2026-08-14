const academicSemesterService =
    require("../services/academicSemester.service");

const prisma = require("../config/prisma");


// GET all academic semesters
const getAllAcademicSemesters = async (req, res) => {
    try {
        const semesters =
            await academicSemesterService.getAllAcademicSemesters();

        res.status(200).json(semesters);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch academic semesters"
        });
    }
};


// GET academic semester by ID
const getAcademicSemesterById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid academic semester ID"
            });
        }

        const semester =
            await academicSemesterService.getAcademicSemesterById(id);

        if (!semester) {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }

        res.status(200).json(semester);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch academic semester"
        });
    }
};


// CREATE academic semester
const createAcademicSemester = async (req, res) => {
    try {
        const {
            name,
            order,
            programId
        } = req.body;


        // 1. Required fields
        if (
            !name ||
            order === undefined ||
            programId === undefined
        ) {
            return res.status(400).json({
                message: "Name, order and programId are required"
            });
        }


        // 2. Name validation
        if (typeof name !== "string") {
            return res.status(400).json({
                message: "Name must be a string"
            });
        }


        if (name.trim() === "") {
            return res.status(400).json({
                message: "Name cannot be empty"
            });
        }


        // 3. Order validation
        if (
            !Number.isInteger(Number(order)) ||
            Number(order) <= 0
        ) {
            return res.status(400).json({
                message: "Order must be a positive integer"
            });
        }


        // 4. Program ID validation
        if (
            !Number.isInteger(Number(programId)) ||
            Number(programId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }


        // 5. Check program exists
        const program =
            await prisma.program.findUnique({
                where: {
                    id: Number(programId)
                }
            });


        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }


        // 6. Semester limit
        if (
            program.programType === "BACHELOR" &&
            Number(order) > 8
        ) {
            return res.status(400).json({
                message: "Bachelor programs can have maximum 8 semesters"
            });
        }


        if (
            program.programType === "MASTER" &&
            Number(order) > 4
        ) {
            return res.status(400).json({
                message: "Master programs can have maximum 4 semesters"
            });
        }


        // 7. Create semester
        const semester =
            await academicSemesterService.createAcademicSemester(
                name,
                order,
                programId
            );


        res.status(201).json(semester);

    } catch (error) {
        console.error(error);


        // Duplicate semester order for same program
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This semester order already exists for this program"
            });
        }


        res.status(500).json({
            message: "Failed to create academic semester"
        });
    }
};


// UPDATE academic semester
const updateAcademicSemester = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            order,
            programId
        } = req.body;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid academic semester ID"
            });
        }


        // 2. Required fields
        if (
            !name ||
            order === undefined ||
            programId === undefined
        ) {
            return res.status(400).json({
                message: "Name, order and programId are required"
            });
        }


        // 3. Name validation
        if (
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                message: "Name must be a non-empty string"
            });
        }


        // 4. Order validation
        if (
            !Number.isInteger(Number(order)) ||
            Number(order) <= 0
        ) {
            return res.status(400).json({
                message: "Order must be a positive integer"
            });
        }


        // 5. Program ID validation
        if (
            !Number.isInteger(Number(programId)) ||
            Number(programId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }


        // 6. Check semester exists
        const existingSemester =
            await academicSemesterService.getAcademicSemesterById(id);

        if (!existingSemester) {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }


        // 7. Check program exists
        const program =
            await prisma.program.findUnique({
                where: {
                    id: Number(programId)
                }
            });


        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }


        // 8. Semester limit
        if (
            program.programType === "BACHELOR" &&
            Number(order) > 8
        ) {
            return res.status(400).json({
                message: "Bachelor programs can have maximum 8 semesters"
            });
        }


        if (
            program.programType === "MASTER" &&
            Number(order) > 4
        ) {
            return res.status(400).json({
                message: "Master programs can have maximum 4 semesters"
            });
        }


        // 9. Update semester
        const semester =
            await academicSemesterService.updateAcademicSemester(
                id,
                name,
                order,
                programId
            );


        res.status(200).json(semester);

    } catch (error) {
        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This semester order already exists for this program"
            });
        }


        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }


        res.status(500).json({
            message: "Failed to update academic semester"
        });
    }
};


// DELETE academic semester
const deleteAcademicSemester = async (req, res) => {
    try {
        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid academic semester ID"
            });
        }


        const existingSemester =
            await academicSemesterService.getAcademicSemesterById(id);

        if (!existingSemester) {
            return res.status(404).json({
                message: "Academic semester not found"
            });
        }


        await academicSemesterService.deleteAcademicSemester(id);


        res.status(200).json({
            message: "Academic semester deleted successfully"
        });

    } catch (error) {
        console.error(error);


        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete academic semester because it has related records"
            });
        }


        res.status(500).json({
            message: "Failed to delete academic semester"
        });
    }
};


module.exports = {
    getAllAcademicSemesters,
    getAcademicSemesterById,
    createAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester
};