import React, { useState, useContext } from "react";
import { format } from "date-fns";
import { NotificationContext } from "./NotificationContext";

const NotificationPanel = () => {
  const {
    notifications,
    isLoading,
    markAllAsRead,
    handleNotificationClick,
    deleteAllNotifications,
  } = useContext(NotificationContext);
  const [showHistory, setShowHistory] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.hasSeen);
  const readNotifications = notifications.filter((n) => n.hasSeen);
  const unreadCount = unreadNotifications.length;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-bell me-2 text-primary"></i>
            <h5 className="mb-0">Notifications</h5>
            {unreadCount > 0 && (
              <span className="ms-2 badge bg-primary rounded-pill">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                onClick={markAllAsRead}
              >
                <i className="bi bi-check2-all me-2"></i>
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center"
                onClick={() => deleteAllNotifications()}
              >
                <i className={`bi bi-trash me-2`}></i>
                Delete
              </button>
            )}
            {readNotifications.length > 0 && (
              <button
                className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                onClick={() => setShowHistory(!showHistory)}
              >
                <i
                  className={`bi bi-eye${showHistory ? "-slash" : ""} me-2`}
                ></i>
                {showHistory ? "Hide History" : "Show History"}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : unreadNotifications.length === 0 && !showHistory ? (
          <div className="text-center py-1">
            <i className="bi bi-bell-slash display-6 text-muted mb-3 d-block"></i>
            <p className="text-muted">No new notifications</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <>
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="card border-primary"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body p-2">
                      <div className="d-flex align-items-center gap-2">
                        <i
                          className="bi bi-circle-fill text-primary"
                          style={{ fontSize: "0.5rem" }}
                        ></i>
                        <div>
                          <p className="mb-1 small">{notification.content}</p>
                          <small className="text-muted">
                            {format(new Date(notification.createdAt), "PPp")}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Read Notifications (History) */}
            {showHistory && readNotifications.length > 0 && (
              <>
                <div className="mt-2 mb-0">
                  <h6 className="text-muted mb-0">History</h6>
                </div>
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="card border"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body p-2">
                      <p className="mb-1 small">{notification.content}</p>
                      <small className="text-muted">
                        {format(new Date(notification.createdAt), "PPp")}
                      </small>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
