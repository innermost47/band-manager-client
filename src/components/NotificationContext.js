import { createContext, useEffect, useState } from "react";
import { notificationService } from "../api/notificationService";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import { confirmAlert } from "react-confirm-alert";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(
        notifications.map((notif) => ({
          ...notif,
          hasSeen: true,
        }))
      );
      showToast("All notifications marked as read successfully", "success");
    } catch (err) {
      console.error("Failed to mark notifications as read");
      showToast(
        "Failed to mark notifications as read. Please try again.",
        "error"
      );
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.hasSeen) {
      try {
        await notificationService.markNotificationAsRead(notification.id);
        setNotifications(
          notifications.map((n) =>
            n.id === notification.id ? { ...n, hasSeen: true } : n
          )
        );
      } catch (err) {
        console.error("Failed to mark notification as read");
      }
    }
    navigate(notification.frontEndUrl);
  };

  const deleteAllNotifications = async () => {
    confirmAlert({
      title: "Clear Notification History",
      message: "Clear all notification history?",
      buttons: [
        {
          label: "Yes, Clear",
          onClick: async () => {
            try {
              await notificationService.deleteAllNotifications();
              await fetchNotifications();
              showToast("Notifications successfully cleared", "success");
            } catch (err) {
              console.error("Failed to delete notifications");
              showToast(
                "Error clearing notifications. Please try again.",
                "error"
              );
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        isLoading,
        markAllAsRead,
        handleNotificationClick,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
