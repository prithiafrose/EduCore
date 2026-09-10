const express = require("express");

const router = express.Router();

const notificationController =
require("../controllers/notification.controller");

const {
  authorize
} = require("../middleware/role.middleware");

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
authorize("ADMIN"),
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

// ARCHIVE notification (admin)
router.patch(
"/:id/archive",
authorize("ADMIN"),
notificationController.archiveNotification
);

// UNARCHIVE notification (admin)
router.patch(
"/:id/unarchive",
authorize("ADMIN"),
notificationController.unarchiveNotification
);

// DELETE notification
router.delete(
"/:id",
authorize("ADMIN"),
notificationController.deleteNotification
);

module.exports = router;