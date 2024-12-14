import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center">
        <i className="bi bi-exclamation-triangle-fill text-danger display-1"></i>
        <h1 className="mt-3">Page Not Found</h1>
        <p className="text-muted">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="d-flex flex-wrap justify-content-center mt-4">
        <div className="card m-3 shadow" style={{ width: "20rem" }}>
          <div className="card-body text-center">
            <i className="bi bi-grid-fill text-primary display-4"></i>
            <h5 className="card-title mt-3">Go Back Dashboard</h5>
            <p className="card-text text-muted">
              Return to the dashboard and explore other sections.
            </p>
            <a
              href="#"
              className="btn btn-primary"
              onClick={navigate("/dashboard")}
            >
              <i className="bi bi-grid-fill me-2"></i>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
