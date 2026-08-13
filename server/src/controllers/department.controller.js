const departmentService = require("../services/department.service");


// GET all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments =
            await departmentService.getAllDepartments();

        res.status(200).json(departments);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch departments"
        });
    }
};


// GET department by ID
const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }

        const department =
            await departmentService.getDepartmentById(id);

        if (!department) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json(department);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch department"
        });
    }
};


// CREATE department
const createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;


        // Required fields
        if (!name || !code) {
            return res.status(400).json({
                message: "Name and code are required"
            });
        }


        // Data type validation
        if (
            typeof name !== "string" ||
            typeof code !== "string"
        ) {
            return res.status(400).json({
                message: "Name and code must be strings"
            });
        }


        // Empty/whitespace validation
        if (
            name.trim() === "" ||
            code.trim() === ""
        ) {
            return res.status(400).json({
                message: "Name and code cannot be empty"
            });
        }


        const department =
            await departmentService.createDepartment(
                name,
                code
            );

        res.status(201).json(department);

    } catch (error) {
        console.error(error);


        // Duplicate department code
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Department code already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create department"
        });
    }
};


// UPDATE department
const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;


        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }


        if (!name || !code) {
            return res.status(400).json({
                message: "Name and code are required"
            });
        }


        if (
            typeof name !== "string" ||
            typeof code !== "string"
        ) {
            return res.status(400).json({
                message: "Name and code must be strings"
            });
        }


        if (
            name.trim() === "" ||
            code.trim() === ""
        ) {
            return res.status(400).json({
                message: "Name and code cannot be empty"
            });
        }


        const existingDepartment =
            await departmentService.getDepartmentById(id);

        if (!existingDepartment) {
            return res.status(404).json({
                message: "Department not found"
            });
        }


        const department =
            await departmentService.updateDepartment(
                id,
                name,
                code
            );

        res.status(200).json(department);

    } catch (error) {
        console.error(error);


        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Department code already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update department"
        });
    }
};


const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                message: "Invalid department ID"
            });
        }

        const result =
            await departmentService.deleteDepartment(id);

        if (result.notFound) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        if (result.hasPrograms) {
            return res.status(409).json({
                message:
                    "Cannot delete department because it has related programs"
            });
        }

        return res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to delete department"
        });
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};