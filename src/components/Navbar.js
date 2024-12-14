import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeContext";
import { notificationService } from "../api/notificationService";
import { useContext } from "react";
import { format } from "date-fns";
import { NotificationContext } from "./NotificationContext";

const Navbar = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { notifications, isLoading, handleNotificationClick } =
    useContext(NotificationContext);
  const unreadNotifications = notifications.filter((n) => !n.hasSeen);

  const handleLogout = () => {
    confirmAlert({
      title: "Confirm Logout",
      message:
        "Are you sure you want to logout? This will end your current session.",
      buttons: [
        {
          label: "Yes, Logout",
          onClick: () => {
            localStorage.removeItem("token");
            navigate("/");
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
    <nav
      className={`navbar navbar-expand-lg shadow-sm sticky-top ${
        isDarkMode ? "bg-dark" : "bg-light"
      }`}
    >
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/dashboard"
        >
          <div
            className="rounded-circle bg-primary bg-opacity-10 p-2 me-2 d-flex align-items-center justify-content-center"
            style={{ width: "35px", height: "35px" }}
          >
            <i className="bi bi-grid-fill text-primary"></i>
          </div>
          <span className="fw-bold">Dashboard</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item px-1">
              <Link
                className="nav-link d-flex align-items-center"
                to="/profile"
              >
                <i className="bi bi-person me-2"></i>
                My Profile
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link
                className="nav-link d-flex align-items-center"
                to="/profiles"
              >
                <i className="bi bi-people me-2"></i>
                Public Profiles
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link
                className="nav-link d-flex align-items-center"
                to="/projects"
              >
                <i className="bi bi-folder me-2"></i>
                Projects
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link
                className="nav-link d-flex align-items-center"
                to="/join-project"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Join Project
              </Link>
            </li>
            <li className="nav-item px-1">
              <Link
                className="nav-link d-flex align-items-center"
                to="/administrative-tasks"
              >
                <i className="bi bi-list-check me-2"></i>
                Administrative Tasks
              </Link>
            </li>
          </ul>
          <div className="d-flex gap-2">
            <ThemeToggle />
            <div className="dropdown">
              <button
                className="btn btn-outline-success rounded-pill d-flex align-items-center position-relative"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-bell fs-5"></i>
                {unreadNotifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadNotifications.length}
                    <span className="visually-hidden">
                      unread notifications
                    </span>
                  </span>
                )}
              </button>
              <div
                className="dropdown-menu dropdown-menu-end"
                style={{
                  minWidth: "300px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                  <h6 className="mb-0">Notifications</h6>
                  <Link to="/dashboard" className="text-decoration-none">
                    View All
                  </Link>
                </div>
                {isLoading ? (
                  <div className="text-center p-3">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : unreadNotifications.length === 0 ? (
                  <div className="p-3 text-center text-muted">
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <Link
                      key={notification.id}
                      to={notification.frontEndUrl}
                      className="dropdown-item p-3 border-bottom"
                      onClick={(e) => handleNotificationClick(notification, e)}
                    >
                      <p className="mb-1 text-wrap">{notification.content}</p>
                      <small className="text-muted">
                        {format(new Date(notification.createdAt), "PPp")}
                      </small>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <button
              className="btn btn-outline-danger rounded-pill d-flex align-items-center"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-left me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
