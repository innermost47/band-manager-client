import { React } from "react";

const DashboardElementPresentation = ({ title, text, icon }) => {
  return (
    <div className="d-flex align-items-center">
      <div
        className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
        style={{
          width: "40px",
          height: "40px",
          minWidth: "40px",
        }}
      >
        <i className={`bi ${icon} text-primary`}></i>
      </div>
      <div>
        <h6 className="mb-1">{title}</h6>
        <p className="text-muted small mb-0">{text}</p>
      </div>
    </div>
  );
};

export default DashboardElementPresentation;
