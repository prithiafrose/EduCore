const teacherAssignmentService =
    require("../services/teacherAssignment.service");

const teacherService = require("../services/teacher.service");
const courseOfferingService = require("../services/courseOffering.service");
const sectionService = require("../services/section.service");
// GET teacher assignments by teacher ID
const getTeacherAssignmentsByTeacher = async (
    req,
    res
) => {

    try {

        const { teacherId } = req.params;

        if (
            !Number.isInteger(Number(teacherId)) ||
            Number(teacherId) <= 0
        ) {

            return res.status(400).json({
                message: "Invalid teacher ID"
            });

        }

        const assignments =
            await teacherAssignmentService
                .getTeacherAssignmentsByTeacher(
                    teacherId
                );

        res.status(200).json(assignments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Failed to fetch teacher assignments"
        });

    }

};


// GET all teacher assignments
const getAllTeacherAssignments = async (req, res) => {
    try {

        const assignments =
            await teacherAssignmentService.getAllTeacherAssignments();

        res.status(200).json(assignments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch teacher assignments"
        });
    }
};


// GET teacher assignment by ID
const getTeacherAssignmentById = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher assignment ID"
            });
        }

        const assignment =
            await teacherAssignmentService
                .getTeacherAssignmentById(id);

        if (!assignment) {
            return res.status(404).json({
                message: "Teacher assignment not found"
            });
        }

        res.status(200).json(assignment);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch teacher assignment"
        });
    }
};
// CREATE teacher assignment
const createTeacherAssignment = async (req, res) => {
    try {

        const {
            teacherId,
            courseOfferingId,
            sectionId
        } = req.body;


        // 1. Required fields
        if (
            teacherId === undefined ||
            courseOfferingId === undefined
        ) {
            return res.status(400).json({
                message:
                    "teacherId and courseOfferingId are required"
            });
        }


        // 2. Validate teacherId
        if (
            !Number.isInteger(Number(teacherId)) ||
            Number(teacherId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher ID"
            });
        }


        // 3. Validate courseOfferingId
        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        // 4. Validate sectionId if provided
        if (
            sectionId !== undefined &&
            sectionId !== null &&
            (
                !Number.isInteger(Number(sectionId)) ||
                Number(sectionId) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }


        // 5. Check teacher exists
        const teacher =
            await teacherService.getTeacherById(teacherId);

        if (!teacher) {
            return res.status(404).json({
                message: "Teacher not found"
            });
        }


        // 6. Check course offering exists
        const courseOffering =
            await courseOfferingService.getCourseOfferingById(courseOfferingId);

        if (!courseOffering) {
            return res.status(404).json({
                message: "Course offering not found"
            });
        }


        // 7. Check section if provided
        let section = null;

        if (sectionId !== undefined && sectionId !== null) {

            section =
                await sectionService.getSectionById(sectionId);


            if (!section) {
                return res.status(404).json({
                    message: "Section not found"
                });
            }


            // 8. Check section belongs to course offering
            if (
                section.courseOfferingId !==
                Number(courseOfferingId)
            ) {
                return res.status(400).json({
                    message:
                        "Section does not belong to this course offering"
                });
            }
        }


        // 9. Create teacher assignment
        const assignment =
            await teacherAssignmentService
                .createTeacherAssignment(
                    Number(teacherId),
                    Number(courseOfferingId),
                    sectionId !== undefined &&
                    sectionId !== null
                        ? Number(sectionId)
                        : null
                );


        res.status(201).json(assignment);

    } catch (error) {

        console.error(error);


        // Duplicate assignment
        if (error.code === "P2002") {
            return res.status(409).json({
                message:
                    "This teacher is already assigned to this course offering and section"
            });
        }


        res.status(500).json({
            message: "Failed to create teacher assignment"
        });
    }
};
// DELETE teacher assignment
const deleteTeacherAssignment = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher assignment ID"
            });
        }

        const existing =
            await teacherAssignmentService
                .getTeacherAssignmentById(id);

        if (!existing) {
            return res.status(404).json({
                message: "Teacher assignment not found"
            });
        }

        await teacherAssignmentService
            .deleteTeacherAssignment(id);

        res.status(200).json({
            success: true,
            message: "Teacher assignment deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete teacher assignment"
        });
    }
};
module.exports = {
    getAllTeacherAssignments,
    getTeacherAssignmentById,
        getTeacherAssignmentsByTeacher,

    createTeacherAssignment,
    deleteTeacherAssignment
};