const sectionService = require("../services/section.service");
const prisma = require("../config/prisma");


// GET all sections
const getAllSections = async (req, res) => {
    try {
        const sections = await sectionService.getAllSections();

        res.status(200).json(sections);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch sections"
        });
    }
};


// GET section by ID
const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }

        const section =
            await sectionService.getSectionById(id);

        if (!section) {
            return res.status(404).json({
                message: "Section not found"
            });
        }

        res.status(200).json(section);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch section"
        });
    }
};


// CREATE section
const createSection = async (req, res) => {
    try {
        const {
            name,
            courseOfferingId
        } = req.body;


        // 1. Required fields
        if (
            name === undefined ||
            courseOfferingId === undefined
        ) {
            return res.status(400).json({
                message:
                    "name and courseOfferingId are required"
            });
        }


        // 2. Validate name
        if (
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                message: "Section name is required"
            });
        }


        // 3. Validate Course Offering ID
        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        // 4. Check course offering exists
        const courseOffering =
            await prisma.courseOffering.findUnique({
                where: {
                    id: Number(courseOfferingId)
                }
            });

        if (!courseOffering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        // 5. Create section
        const section =
            await sectionService.createSection(
                name.trim(),
                courseOfferingId
            );

        res.status(201).json(section);

    } catch (error) {
        console.error(error);


        // Duplicate section name
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This section already exists for this course offering"
            });
        }


        res.status(500).json({
            message: "Failed to create section"
        });
    }
};


// UPDATE section
const updateSection = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            courseOfferingId
        } = req.body;


        // 1. Validate Section ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }


        // 2. Required fields
        if (
            name === undefined ||
            courseOfferingId === undefined
        ) {
            return res.status(400).json({
                message:
                    "name and courseOfferingId are required"
            });
        }


        // 3. Validate name
        if (
            typeof name !== "string" ||
            name.trim() === ""
        ) {
            return res.status(400).json({
                message: "Section name is required"
            });
        }


        // 4. Validate Course Offering ID
        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        // 5. Check section exists
        const existingSection =
            await sectionService.getSectionById(id);

        if (!existingSection) {
            return res.status(404).json({
                message: "Section not found"
            });
        }


        // 6. Check course offering exists
        const courseOffering =
            await prisma.courseOffering.findUnique({
                where: {
                    id: Number(courseOfferingId)
                }
            });

        if (!courseOffering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        // 7. Update section
        const section =
            await sectionService.updateSection(
                id,
                name.trim(),
                courseOfferingId
            );

        res.status(200).json(section);

    } catch (error) {
        console.error(error);


        // Duplicate section name
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This section already exists for this course offering"
            });
        }


        // Record not found
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Section not found"
            });
        }


        res.status(500).json({
            message: "Failed to update section"
        });
    }
};


// DELETE section
const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;


        // 1. Validate ID
        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }


        // 2. Check section exists
        const existingSection =
            await sectionService.getSectionById(id);

        if (!existingSection) {
            return res.status(404).json({
                message: "Section not found"
            });
        }


        // 3. Delete
        await sectionService.deleteSection(id);


        res.status(200).json({
            message: "Section deleted successfully"
        });

    } catch (error) {
        console.error(error);


        // Related records exist
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete section because it has related records"
            });
        }


        res.status(500).json({
            message: "Failed to delete section"
        });
    }
};


module.exports = {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
};