const classSessionService = require("../services/classSession.service");

// GET /api/class-sessions
const getAllClassSessions = async (req, res) => {
    try {
        const classSessions =
            await classSessionService.getAllClassSessions();

        res.status(200).json({
            success: true,
            data: classSessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET /api/class-sessions/:id
const getClassSessionById = async (req, res) => {
    try {
        const classSession =
            await classSessionService.getClassSessionById(
                req.params.id
            );

        if (!classSession) {
            return res.status(404).json({
                success: false,
                message: "Class session not found"
            });
        }

        res.status(200).json({
            success: true,
            data: classSession
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// POST /api/class-sessions
const createClassSession = async (req, res) => {
    try {
        const classSession =
            await classSessionService.createClassSession(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Class session created successfully",
            data: classSession
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// PUT /api/class-sessions/:id
const updateClassSession = async (req, res) => {
    try {
        const classSession =
            await classSessionService.updateClassSession(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Class session updated successfully",
            data: classSession
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// PATCH /api/class-sessions/:id/cancel
const cancelClassSession = async (req, res) => {
    try {
        const classSession =
            await classSessionService.cancelClassSession(
                req.params.id
            );

        res.status(200).json({
            success: true,
            message: "Class session cancelled successfully",
            data: classSession
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// POST /api/class-sessions/:id/reschedule
const rescheduleClassSession = async (req, res) => {
    try {
        const result =
            await classSessionService.rescheduleClassSession(
                req.params.id,
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Class session rescheduled successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getAllClassSessions,
    getClassSessionById,
    createClassSession,
    updateClassSession,
    cancelClassSession,
    rescheduleClassSession
};