const prisma = require("../config/prisma");

// Create notification
const createNotification = async ({
    userId,
    type,
    title,
    message
}) => {

    // Check user exists
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.notification.create({
        data: {
            userId: Number(userId),
            type,
            title,
            message
        }
    });
};


// Get all notifications
const getAllNotifications = async () => {

    return await prisma.notification.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};


// Get notification by ID
const getNotificationById = async (id) => {

    return await prisma.notification.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true
                }
            }
        }
    });
};


// Get notifications for one user
const getNotificationsByUser = async (userId) => {

    // Check user exists
    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.notification.findMany({
        where: {
            userId: Number(userId)
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};


// Mark notification as read
const markNotificationAsRead = async (id) => {

    const notification =
        await prisma.notification.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return await prisma.notification.update({
        where: {
            id: Number(id)
        },
        data: {
            isRead: true
        }
    });
};


// Mark all notifications as read for a user
const markAllNotificationsAsRead = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.notification.updateMany({
        where: {
            userId: Number(userId),
            isRead: false
        },
        data: {
            isRead: true
        }
    });
};


// Delete notification
const deleteNotification = async (id) => {

    const notification =
        await prisma.notification.findUnique({
            where: {
                id: Number(id)
            }
        });

    if (!notification) {
        throw new Error("Notification not found");
    }

    return await prisma.notification.delete({
        where: {
            id: Number(id)
        }
    });
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