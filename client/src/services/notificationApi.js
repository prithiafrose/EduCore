import api from "./axios";

// GET all notifications
export const getAllNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// GET notifications by user
export const getNotificationsByUser = async (userId) => {
  const response = await api.get(`/notifications/user/${userId}`);
  return response.data;
};

// GET notification by ID
export const getNotificationById = async (id) => {
  const response = await api.get(`/notifications/${id}`);
  return response.data;
};

// CREATE notification
export const createNotification = async (
  userId,
  type,
  title,
  message
) => {
  const response = await api.post("/notifications", {
    userId: Number(userId),
    type,
    title,
    message,
  });

  return response.data;
};

// MARK notification as read
export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

// MARK all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  const response = await api.patch(
    `/notifications/user/${userId}/read-all`
  );

  return response.data;
};

// ARCHIVE notification (admin)
export const archiveNotification = async (id) => {
  const response = await api.patch(`/notifications/${id}/archive`);
  return response.data;
};

// UNARCHIVE notification (admin)
export const unarchiveNotification = async (id) => {
  const response = await api.patch(`/notifications/${id}/unarchive`);
  return response.data;
};

// DELETE notification
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};