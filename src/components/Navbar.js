import { Link, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

const Navbar = () => {
  const navigate = useNavigate();

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
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top bg-dark">
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
                to="/administrative-tasks"
              >
                <i className="bi bi-list-check me-2"></i>
                Administrative Tasks
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
          </ul>

          <button
            className="btn btn-outline-danger rounded-pill d-flex align-items-center"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
