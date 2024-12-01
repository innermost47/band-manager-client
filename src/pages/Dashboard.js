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
    <div className="container mt-5">
      <h2 className="text-center">Dashboard</h2>
      <p>Welcome to the dashboard!</p>
      <div className="list-group mt-4">
        <button
          className="list-group-item list-group-item-action"
          onClick={() => navigate("/administrative-tasks")}
        >
          Administrative Tasks
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => navigate("/boards")}
        >
          Boards
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => navigate("/events")}
        >
          Events
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => navigate("/projects")}
        >
          Projects
        </button>
        <button
          className="list-group-item list-group-item-action"
          onClick={() => navigate("/users")}
        >
          Users
        </button>
      </div>
      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
