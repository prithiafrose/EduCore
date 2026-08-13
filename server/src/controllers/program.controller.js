const programService = require("../services/program.service");
const prisma = require("../config/prisma");


// GET all programs
const getAllPrograms = async (req, res) => {
    try {
        const programs =
            await programService.getAllPrograms();

        res.status(200).json(programs);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch programs"
        });
    }
};


// GET program by ID
const getProgramById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }

        const program =
            await programService.getProgramById(id);

        if (!program) {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        res.status(200).json(program);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch program"
        });
    }
};


// CREATE program
const createProgram = async (req, res) => {
    try {
        const {
            name,
            code,
            durationYears,
            departmentId
        } = req.body;


        // 1. Required fields
        if (!name || !code || departmentId === undefined) {
            return res.status(400).json({
                message: "Name, code and departmentId are required"
            });
        }


        // 2. Data type validation
        if (
            typeof name !== "string" ||
            typeof code !== "string"
        ) {
            return res.status(400).json({
                message: "Name and code must be strings"
            });
        }


        // 3. Empty/whitespace validation
        if (
            name.trim() === "" ||
            code.trim() === ""
        ) {
            return res.status(400).json({
                message: "Name and code cannot be empty"
            });
        }


        // 4. Department ID validation
        if (
            !Number.isInteger(Number(departmentId)) ||
            Number(departmentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }


        // 5. Duration validation
        if (
            durationYears !== undefined &&
            durationYears !== null &&
            (
                !Number.isInteger(Number(durationYears)) ||
                Number(durationYears) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Duration must be a positive integer"
            });
        }


        // 6. Check department exists
        const department =
            await prisma.department.findUnique({
                where: {
                    id: Number(departmentId)
                }
            });


        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        // 7. Create program
        const program =
            await programService.createProgram(
                name,
                code,
                durationYears !== undefined &&
                durationYears !== null
                    ? Number(durationYears)
                    : null,
                departmentId
            );


        res.status(201).json(program);

    } catch (error) {
        console.error(error);


        // Duplicate program code
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Program code already exists"
            });
        }


        res.status(500).json({
            message: "Failed to create program"
        });
    }
};


// UPDATE program
// UPDATE program
const updateProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            code,
            durationYears,
            departmentId
        } = req.body;


        // 1. Validate program ID
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }


        // 2. Required fields
        if (!name || !code || departmentId === undefined) {
            return res.status(400).json({
                message: "Name, code and departmentId are required"
            });
        }


        // 3. Data type validation
        if (
            typeof name !== "string" ||
            typeof code !== "string"
        ) {
            return res.status(400).json({
                message: "Name and code must be strings"
            });
        }


        // 4. Empty/whitespace validation
        if (
            name.trim() === "" ||
            code.trim() === ""
        ) {
            return res.status(400).json({
                message: "Name and code cannot be empty"
            });
        }


        // 5. Department ID validation
        if (
            !Number.isInteger(Number(departmentId)) ||
            Number(departmentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }


        // 6. Duration validation
        if (
            durationYears !== undefined &&
            durationYears !== null &&
            (
                !Number.isInteger(Number(durationYears)) ||
                Number(durationYears) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Duration must be a positive integer"
            });
        }


        // 7. Check program exists
        const existingProgram =
            await programService.getProgramById(Number(id));

        if (!existingProgram) {
            return res.status(404).json({
                message: "Program not found"
            });
        }


        // 8. Check department exists
        const department =
            await prisma.department.findUnique({
                where: {
                    id: Number(departmentId)
                }
            });

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        // 9. Update program
        const program =
            await programService.updateProgram(
                Number(id),
                name,
                code,
                durationYears !== undefined &&
                durationYears !== null
                    ? Number(durationYears)
                    : null,
                Number(departmentId)
            );


        res.status(200).json(program);

    } catch (error) {
        console.error(error);

        // Duplicate program code
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Program code already exists"
            });
        }

        // Program not found
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        res.status(500).json({
            message: "Failed to update program"
        });
    }
};


// DELETE program
// DELETE program
const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Validate ID
        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid program ID"
            });
        }

        // 2. Check program exists
        const existingProgram =
            await programService.getProgramById(Number(id));

        if (!existingProgram) {
            return res.status(404).json({
                message: "Program not found"
            });
        }

        // 3. Delete program
        await programService.deleteProgram(Number(id));

        return res.status(200).json({
            message: "Program deleted successfully"
        });

    } catch (error) {
        console.error(error);

        // Program has related records
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete program because it has related records"
            });
        }

        return res.status(500).json({
            message: "Failed to delete program"
        });
    }
};


module.exports = {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
};