import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import NotificationPanel from "../components/NotificationPanel";
import DashboardElementPresentation from "../components/DashboardElementPresentation";

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
      <NotificationPanel />
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
                <DashboardElementPresentation
                  icon={"bi-person"}
                  title={"My Profile"}
                  text={"Manage your account settings and information"}
                />
                <DashboardElementPresentation
                  icon={"bi-people"}
                  title={"Profiles"}
                  text={
                    "Discover and connect with other musicians and collaborators"
                  }
                />
                <DashboardElementPresentation
                  icon={"bi-folder"}
                  title={"Projects"}
                  text={"Track, update, and collaborate on ongoing projects"}
                />
                <DashboardElementPresentation
                  icon={"bi-music-note-list"}
                  title={"Music Library"}
                  text={
                    "Explore and listen to public songs from all public projects"
                  }
                />
                <DashboardElementPresentation
                  icon={"bi-calendar-event"}
                  title={"Public Events"}
                  text={
                    "Discover and follow public project events and activities"
                  }
                />
                <DashboardElementPresentation
                  icon={"bi-list-check"}
                  title={"Tasks"}
                  text={"Manage operations and oversee tasks efficiently"}
                />
                <DashboardElementPresentation
                  icon={"bi-box-arrow-in-right"}
                  title={"Join Project"}
                  text={"Enter invitation code to join existing projects"}
                />
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
                      <i className="bi bi-people-fill me-2"></i> Profiles
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/projects")}
                    >
                      <i className="bi bi-folder me-2"></i> Projects
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/music-library")}
                    >
                      <i className="bi bi-music-note-list me-2"></i> Music
                      Library
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/events")}
                    >
                      <i className="bi bi-calendar me-2"></i> Events
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/administrative-tasks")}
                    >
                      <i className="bi bi-list-check me-2"></i> Tasks
                    </button>
                    <button
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/join-project")}
                    >
                      <i className="bi bi-box-arrow-in-right me-2"></i> Join
                      Project
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
