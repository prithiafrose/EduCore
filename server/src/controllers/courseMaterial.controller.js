const courseMaterialService =
    require("../services/courseMaterial.service");
const teacherService = require("../services/teacher.service");
const { streamFile } = require("../utils/upload");
const {
    canAccessCourseOffering
} = require("../utils/courseOfferingAccess");

// CREATE course material
const createCourseMaterial = async (req, res) => {
    try {
        const data = { ...req.body };

        if (!data.title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            });
        }

        if (!data.courseOfferingId) {
            return res.status(400).json({
                success: false,
                message: "courseOfferingId is required"
            });
        }

        const allowed = await canAccessCourseOffering(
            req.user,
            Number(data.courseOfferingId)
        );

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not assigned to this course offering"
            });
        }

        if (req.user.role === "TEACHER") {
            const teacher =
                await teacherService.getTeacherByUserId(
                    req.user.userId
                );

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher profile not found"
                });
            }

            data.teacherId = teacher.id;
        }

        if (req.file) {
            data.fileName = req.file.originalname;
            data.filePath = req.file.filename;
            data.fileType = req.file.mimetype;
            data.fileSize = req.file.size;
        }

        const material =
            await courseMaterialService.createCourseMaterial(data);

        res.status(201).json({
            success: true,
            message: "Course material uploaded successfully",
            data: material
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET all course materials
const getAllCourseMaterials = async (req, res) => {
    try {
        const materials =
            await courseMaterialService.getAllCourseMaterials();

        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET materials by course offering
const getMaterialsByCourseOffering = async (req, res) => {
    try {
        const courseOfferingId = Number(
            req.params.courseOfferingId
        );

        if (
            !Number.isInteger(courseOfferingId) ||
            courseOfferingId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid course offering ID"
            });
        }

        const materials =
            await courseMaterialService.getMaterialsByCourseOffering(
                courseOfferingId
            );

        res.status(200).json({
            success: true,
            data: materials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DOWNLOAD course material
const downloadCourseMaterial = async (req, res) => {
    try {
        const material =
            await courseMaterialService.getCourseMaterialById(
                Number(req.params.id)
            );

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Course material not found"
            });
        }

        const allowed = await canAccessCourseOffering(
            req.user,
            material.courseOfferingId
        );

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (!material.filePath) {
            return res.status(404).json({
                success: false,
                message: "This material has no file"
            });
        }

        return streamFile(
            res,
            material.filePath,
            material.fileName
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE course material
const deleteCourseMaterial = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid material ID"
            });
        }

        const material =
            await courseMaterialService.getCourseMaterialById(id);

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Course material not found"
            });
        }

        // Only admin or the uploading teacher can delete
        if (req.user.role !== "ADMIN") {
            const teacher =
                await teacherService.getTeacherByUserId(
                    req.user.userId
                );

            if (
                !teacher ||
                teacher.id !== material.teacherId
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }
        }

        await courseMaterialService.deleteCourseMaterial(id);

        res.status(200).json({
            success: true,
            message: "Course material deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourseMaterial,
    getAllCourseMaterials,
    getMaterialsByCourseOffering,
    downloadCourseMaterial,
    deleteCourseMaterial
};