const notificationService =
    require("../services/notification.service");


// CREATE notification
const createNotification = async (req, res) => {
    try {

        const {
            userId,
            type,
            title,
            message
        } = req.body;


        // Required fields
        if (
            !userId ||
            !type ||
            !title ||
            !message
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "userId, type, title and message are required"
            });
        }


        // Validate notification type
        const validTypes = [
            "GENERAL",
            "CLASS_CANCELLED",
            "CLASS_RESCHEDULED",
            "CLASS_REMINDER",
            "ASSIGNMENT",
            "ASSIGNMENT_DEADLINE",
            "ASSESSMENT_MARK_PUBLISHED",
            "RESULT_PUBLISHED",
            "PAYMENT_DUE",
            "EXAM_SCHEDULE"
        ];


        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification type"
            });
        }


        const notification =
            await notificationService.createNotification({
                userId,
                type,
                title,
                message
            });


        res.status(201).json({
            success: true,
            message: "Notification created successfully",
            data: notification
        });

    } catch (error) {

        console.error(error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create notification"
        });
    }
};


// GET all notifications
const getAllNotifications = async (req, res) => {
    try {

        const notifications =
            await notificationService.getAllNotifications();

        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};


// GET notification by ID
const getNotificationById = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }


        const notification =
            await notificationService.getNotificationById(id);


        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }


        res.status(200).json({
            success: true,
            data: notification
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch notification"
        });
    }
};


// GET notifications by user
const getNotificationsByUser = async (req, res) => {
    try {

        const { userId } = req.params;


        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }


        const notifications =
            await notificationService
                .getNotificationsByUser(userId);


        res.status(200).json({
            success: true,
            data: notifications
        });

    } catch (error) {

        console.error(error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch user notifications"
        });
    }
};


// MARK notification as read
const markNotificationAsRead = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }


        const notification =
            await notificationService
                .markNotificationAsRead(id);


        res.status(200).json({
            success: true,
            message:
                "Notification marked as read",
            data: notification
        });

    } catch (error) {

        console.error(error);

        if (
            error.message ===
            "Notification not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to mark notification as read"
        });
    }
};


// MARK ALL notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {

        const { userId } = req.params;


        if (
            !Number.isInteger(Number(userId)) ||
            Number(userId) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }


        const result =
            await notificationService
                .markAllNotificationsAsRead(userId);


        res.status(200).json({
            success: true,
            message:
                "All notifications marked as read",
            data: result
        });

    } catch (error) {

        console.error(error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to mark notifications as read"
        });
    }
};


// DELETE notification
const deleteNotification = async (req, res) => {
    try {

        const { id } = req.params;


        if (
            !Number.isInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }


        await notificationService
            .deleteNotification(id);


        res.status(200).json({
            success: true,
            message:
                "Notification deleted successfully"
        });

    } catch (error) {

        console.error(error);

        if (
            error.message ===
            "Notification not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message:
                "Failed to delete notification"
        });
    }
};


module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    getNotificationsByUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};