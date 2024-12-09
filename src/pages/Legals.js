import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Legals = () => {
  const [activeTab, setActiveTab] = useState("legal");
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const privacyItems = [
    "Profile information (name, email, profile picture)",
    "Musical content (audio files, lyrics, tablatures)",
    "Project and band data",
    "Event information",
    "Administrative documents",
    "Login logs for security",
  ];

  const dataUsageItems = [
    "Providing and improving Band Manager services",
    "Enabling content sharing between authorized members",
    "Managing events and administrative tasks",
    "Ensuring platform security",
    "Sending important notifications",
  ];

  const userRights = [
    "Access your personal data",
    "Rectify your information",
    "Delete your account and data",
    "Export your data",
    "Withdraw your consent",
    "Object to data processing",
  ];

  const serviceFeatures = [
    "Music file sharing platform",
    "Project profile creation and management",
    "Music sharing between members",
    "Lyrics and tablature management",
    "Event and rehearsal planning",
    "Administrative document management",
    "Calculation spreadsheets for management",
    "Document signing system",
  ];

  const userObligations = [
    "Respect intellectual property rights",
    "Only share content you have rights to",
    "Maintain account confidentiality",
    "Use the platform in accordance with laws",
    "Do not share your login credentials",
    "Report any suspicious account activity",
  ];

  const limitations = [
    "Content uploaded by users",
    "Conflicts between band members",
    "Data loss due to user error",
    "Internet connection issues",
    "Device compatibility issues",
    "Service interruptions for maintenance",
  ];

  return (
    <div className="min-vh-100">
      {/* Header with navigation */}
      <div className="shadow-sm mb-4">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">Legal Information</h1>
            <button
              onClick={() =>
                navigate(isAuthenticated ? "/dashboard" : "/login")
              }
              className="btn btn-outline-primary btn-sm"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Return to {isAuthenticated ? "Dashboard" : "Login"}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Navigation tabs */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-0">
                <nav className="nav nav-pills nav-fill">
                  {[
                    {
                      id: "legal",
                      label: "Legal Notice",
                      icon: "bi-info-circle",
                    },
                    {
                      id: "privacy",
                      label: "Privacy Policy",
                      icon: "bi-shield-check",
                    },
                    {
                      id: "terms",
                      label: "Terms of Use",
                      icon: "bi-file-text",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`nav-link rounded-0 py-3 ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`bi ${tab.icon} me-2`}></i>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {activeTab === "legal" && (
                  <div className="tab-pane fade show active">
                    <h2 className="h4 mb-4 pb-2 border-bottom">Legal Notice</h2>
                    <div className="space-y-4">
                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          1. Company Information
                        </h3>
                        <p className="text-muted">
                          Band Manager is a web application designed for music
                          projects and bands.
                        </p>
                        <div className="p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                              <strong>Company Name:</strong>{" "}
                              {process.env.REACT_APP_COMPANY_NAME}
                            </li>
                            <li className="mb-2">
                              <strong>Address:</strong>{" "}
                              {process.env.REACT_APP_COMPANY_ADDRESS}
                            </li>
                            <li className="mb-2">
                              <strong>Email:</strong>{" "}
                              <a
                                href={`mailto:${process.env.REACT_APP_COMPANY_EMAIL}`}
                              >
                                {process.env.REACT_APP_COMPANY_EMAIL}
                              </a>
                            </li>
                            <li className="mb-2">
                              <strong>Phone:</strong>{" "}
                              <a
                                href={`tel:${process.env.REACT_APP_COMPANY_PHONE}`}
                              >
                                {process.env.REACT_APP_COMPANY_PHONE}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          2. Intellectual Property
                        </h3>
                        <p className="text-muted">
                          The Band Manager platform and its original content are
                          protected by intellectual property rights. All content
                          uploaded by users remains their exclusive property.
                          Users retain all rights to their music files,
                          documents, and other content.
                        </p>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          3. Hosting Information
                        </h3>
                        <p className="text-muted">
                          This website is hosted by{" "}
                          {process.env.REACT_APP_HOSTING_PROVIDER}.
                        </p>
                      </section>
                    </div>
                  </div>
                )}

                {activeTab === "privacy" && (
                  <div className="tab-pane fade show active">
                    <h2 className="h4 mb-4 pb-2 border-bottom">
                      Privacy Policy
                    </h2>
                    <div className="space-y-4">
                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          1. Data Collection
                        </h3>
                        <p className="text-muted">
                          Band Manager collects and processes the following
                          data:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {privacyItems.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">2. Data Usage</h3>
                        <p className="text-muted">
                          Your data is used exclusively for:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {dataUsageItems.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          3. Data Protection
                        </h3>
                        <p className="text-muted">
                          We implement technical and organizational security
                          measures to protect your data. This includes data
                          encryption, regular backups, and strict security
                          protocols for data access.
                        </p>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">4. User Rights</h3>
                        <p className="text-muted">
                          In accordance with GDPR, you have the following
                          rights:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {userRights.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    </div>
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="tab-pane fade show active">
                    <h2 className="h4 mb-4 pb-2 border-bottom">Terms of Use</h2>
                    <div className="space-y-4">
                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          1. Service Description
                        </h3>
                        <p className="text-muted">
                          Band Manager provides the following services:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {serviceFeatures.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          2. User Obligations
                        </h3>
                        <p className="text-muted">
                          By using Band Manager, you agree to:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {userObligations.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          3. Content Ownership
                        </h3>
                        <p className="text-muted">
                          All content uploaded to Band Manager remains the
                          exclusive property of the users who uploaded it. Users
                          retain all rights to their music, documents, and other
                          materials. Band Manager commits to not using this
                          content for any purpose other than providing the
                          service.
                        </p>
                      </section>

                      <section className="mb-4">
                        <h3 className="h5 mb-3 text-primary">
                          4. Liability Limitations
                        </h3>
                        <p className="text-muted">
                          Band Manager is not responsible for:
                        </p>
                        <div className=" p-3 rounded">
                          <ul className="list-unstyled mb-0">
                            {limitations.map((item, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check2-circle text-primary me-2"></i>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legals;
