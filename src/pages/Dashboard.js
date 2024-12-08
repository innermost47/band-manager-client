import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

const Dashboard = () => {
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
    <div className="container mt-5 mb-3">
      {/* Header */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex rounded-circle bg-primary bg-opacity-10 p-3 mb-3 d-flex align-items-center justify-content-center"
          style={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
          }}
        >
          <i className="bi bi-grid-fill fs-2 text-primary"></i>
        </div>
        <h2 className="mb-3">Welcome to Dashboard</h2>
      </div>

      {/* Welcome Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <p className="lead mb-4">
                Your central hub for managing activities and navigating key
                features. Access everything you need to streamline your
                workflow.
              </p>
              <div className="d-grid gap-3">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <i className="bi bi-list-check text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Administrative Tasks</h6>
                    <p className="text-muted small mb-0">
                      Manage operations and oversee tasks efficiently
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <i className="bi bi-folder text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Projects</h6>
                    <p className="text-muted small mb-0">
                      Track, update, and collaborate on ongoing projects
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  >
                    <i className="bi bi-person text-primary"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">My Profile</h6>
                    <p className="text-muted small mb-0">
                      Manage your account settings and information
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mt-4 mt-md-0">
              <div className="card border-0">
                <div className="card-body text-center">
                  <h5 className="mb-3">Quick Navigation</h5>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/profile")}
                    >
                      <i className="bi bi-person-circle me-2"></i> My Profile
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/profiles")}
                    >
                      <i className="bi bi-people-fill me-2"></i> Public Profiles
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/administrative-tasks")}
                    >
                      <i className="bi bi-list-check me-2"></i> Administrative
                      Tasks
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/projects")}
                    >
                      <i className="bi bi-folder me-2"></i> Projects
                    </button>
                    <button
                      className="btn btn-outline-danger d-flex align-items-center justify-content-center mt-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
