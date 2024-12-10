import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer py-3"
      style={{
        bottom: 0,
        width: "100%",
      }}
    >
      <div className="container text-center">
        <span className="text-muted">
          <button
            onClick={() => navigate("/legals")}
            className="btn btn-link text-muted text-decoration-none p-0 mx-2 btn-sm"
          >
            Legal Terms & Privacy Policy
          </button>
        </span>
        <p className="text-muted mt-2 mb-0 small">
          © {currentYear} {process.env.REACT_APP_COMPANY_NAME}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
