const timetableService =
    require("../services/timetable.service");

const prisma = require("../config/prisma");


// GET all timetables
const getAllTimetables = async (req, res) => {
    try {

        const timetables =
            await timetableService.getAllTimetables();

        res.status(200).json(timetables);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch timetables"
        });
    }
};


// GET timetable by ID
const getTimetableById = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid timetable ID"
            });
        }


        const timetable =
            await timetableService.getTimetableById(id);


        if (!timetable) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }


        res.status(200).json(timetable);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch timetable"
        });
    }
};


// CREATE timetable
const createTimetable = async (req, res) => {
    try {

        const {
            courseOfferingId,
            sectionId,
            teacherAssignmentId,
            dayOfWeek,
            startTime,
            endTime,
            room
        } = req.body;


        // Required fields
        if (
            courseOfferingId === undefined ||
            teacherAssignmentId === undefined ||
            dayOfWeek === undefined ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message:
                    "courseOfferingId, teacherAssignmentId, dayOfWeek, startTime and endTime are required"
            });
        }


        // Validate IDs
        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        if (
            sectionId !== null &&
            sectionId !== undefined &&
            (
                !Number.isInteger(Number(sectionId)) ||
                Number(sectionId) <= 0
            )
        ) {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }


        if (
            !Number.isInteger(Number(teacherAssignmentId)) ||
            Number(teacherAssignmentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher assignment ID"
            });
        }


        // Validate day
        if (
            !Number.isInteger(Number(dayOfWeek)) ||
            Number(dayOfWeek) < 0 ||
            Number(dayOfWeek) > 6
        ) {
            return res.status(400).json({
                message:
                    "dayOfWeek must be between 0 and 6"
            });
        }


        // Validate time
        const start = new Date(startTime);
        const end = new Date(endTime);


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid startTime or endTime"
            });
        }


        if (start >= end) {
            return res.status(400).json({
                message:
                    "startTime must be before endTime"
            });
        }


        // Check course offering
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


        // Check section
        if (sectionId !== null && sectionId !== undefined) {

            const section =
                await prisma.section.findUnique({
                    where: {
                        id: Number(sectionId)
                    }
                });


            if (!section) {
                return res.status(404).json({
                    message: "Section not found"
                });
            }


            // Section must belong to same course offering
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


        // Check teacher assignment
        const teacherAssignment =
            await prisma.teacherAssignment.findUnique({
                where: {
                    id: Number(teacherAssignmentId)
                }
            });


        if (!teacherAssignment) {
            return res.status(404).json({
                message: "Teacher assignment not found"
            });
        }


        // Teacher assignment must belong to same offering
        if (
            teacherAssignment.courseOfferingId !==
            Number(courseOfferingId)
        ) {
            return res.status(400).json({
                message:
                    "Teacher assignment does not belong to this course offering"
            });
        }


        // If both section and assignment have sections,
        // they must be the same
        if (
            sectionId !== null &&
            sectionId !== undefined &&
            teacherAssignment.sectionId !== null &&
            teacherAssignment.sectionId !==
                Number(sectionId)
        ) {
            return res.status(400).json({
                message:
                    "Teacher assignment does not belong to this section"
            });
        }


        // Create
        const timetable =
            await timetableService.createTimetable(
                courseOfferingId,
                sectionId ?? null,
                teacherAssignmentId,
                dayOfWeek,
                startTime,
                endTime,
                room
            );


        res.status(201).json(timetable);

    } catch (error) {

        console.error(error);

        if (error.code === "P2003") {
            return res.status(400).json({
                message:
                    "Invalid related record"
            });
        }

        res.status(500).json({
            message: "Failed to create timetable"
        });
    }
};


// UPDATE timetable
const updateTimetable = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            courseOfferingId,
            sectionId,
            teacherAssignmentId,
            dayOfWeek,
            startTime,
            endTime,
            room
        } = req.body;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid timetable ID"
            });
        }


        if (
            courseOfferingId === undefined ||
            teacherAssignmentId === undefined ||
            dayOfWeek === undefined ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message:
                    "courseOfferingId, teacherAssignmentId, dayOfWeek, startTime and endTime are required"
            });
        }


        const existing =
            await timetableService.getTimetableById(id);


        if (!existing) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }


        if (
            !Number.isInteger(Number(courseOfferingId)) ||
            Number(courseOfferingId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid course offering ID"
            });
        }


        if (
            !Number.isInteger(Number(teacherAssignmentId)) ||
            Number(teacherAssignmentId) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid teacher assignment ID"
            });
        }


        if (
            !Number.isInteger(Number(dayOfWeek)) ||
            Number(dayOfWeek) < 0 ||
            Number(dayOfWeek) > 6
        ) {
            return res.status(400).json({
                message:
                    "dayOfWeek must be between 0 and 6"
            });
        }


        const start = new Date(startTime);
        const end = new Date(endTime);


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid startTime or endTime"
            });
        }


        if (start >= end) {
            return res.status(400).json({
                message:
                    "startTime must be before endTime"
            });
        }


        // Check course offering
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


        // Check section
        if (sectionId !== null && sectionId !== undefined) {

            if (
                !Number.isInteger(Number(sectionId)) ||
                Number(sectionId) <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid section ID"
                });
            }


            const section =
                await prisma.section.findUnique({
                    where: {
                        id: Number(sectionId)
                    }
                });


            if (!section) {
                return res.status(404).json({
                    message: "Section not found"
                });
            }


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


        // Check teacher assignment
        const teacherAssignment =
            await prisma.teacherAssignment.findUnique({
                where: {
                    id: Number(teacherAssignmentId)
                }
            });


        if (!teacherAssignment) {
            return res.status(404).json({
                message: "Teacher assignment not found"
            });
        }


        if (
            teacherAssignment.courseOfferingId !==
            Number(courseOfferingId)
        ) {
            return res.status(400).json({
                message:
                    "Teacher assignment does not belong to this course offering"
            });
        }


        if (
            sectionId !== null &&
            sectionId !== undefined &&
            teacherAssignment.sectionId !== null &&
            teacherAssignment.sectionId !==
                Number(sectionId)
        ) {
            return res.status(400).json({
                message:
                    "Teacher assignment does not belong to this section"
            });
        }


        const timetable =
            await timetableService.updateTimetable(
                id,
                courseOfferingId,
                sectionId ?? null,
                teacherAssignmentId,
                dayOfWeek,
                startTime,
                endTime,
                room
            );


        res.status(200).json(timetable);

    } catch (error) {

        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }

        res.status(500).json({
            message: "Failed to update timetable"
        });
    }
};


// DELETE timetable
const deleteTimetable = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                message: "Invalid timetable ID"
            });
        }


        const existing =
            await timetableService.getTimetableById(id);


        if (!existing) {
            return res.status(404).json({
                message: "Timetable not found"
            });
        }


        await timetableService.deleteTimetable(id);


        res.status(200).json({
            message:
                "Timetable deleted successfully"
        });

    } catch (error) {

        console.error(error);

        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete timetable because related records exist"
            });
        }

        res.status(500).json({
            message: "Failed to delete timetable"
        });
    }
};


module.exports = {
    getAllTimetables,
    getTimetableById,
    createTimetable,
    updateTimetable,
    deleteTimetable
};