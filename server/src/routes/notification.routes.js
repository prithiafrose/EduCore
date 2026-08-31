const express = require("express");

const router = express.Router();

const notificationController =
require("../controllers/notification.controller");

// GET all notifications
router.get(
"/",
notificationController.getAllNotifications
);

// GET notifications by user
router.get(
"/user/:userId",
notificationController.getNotificationsByUser
);

// GET notification by ID
router.get(
"/:id",
notificationController.getNotificationById
);

// CREATE notification
router.post(
"/",
notificationController.createNotification
);

// MARK notification as read
router.patch(
"/:id/read",
notificationController.markNotificationAsRead
);

// MARK all notifications as read
router.patch(
"/user/:userId/read-all",
notificationController.markAllNotificationsAsRead
);

// DELETE notification
router.delete(
"/:id",
notificationController.deleteNotification
);

module.exports = router;
