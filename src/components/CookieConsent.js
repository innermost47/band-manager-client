import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasConsent = localStorage.getItem("cookie-consent");
    // Afficher uniquement si pas de choix ou si rejet
    if (!hasConsent || hasConsent === "rejected") {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    window.location.reload(); // Pour forcer la déconnexion
  };

  // Si consentement accepté ou banner caché, ne rien afficher
  if (!showConsent) return null;

  return (
    <div
      className="position-fixed bottom-0 start-0 end-0 bg-dark text-light py-3"
      style={{
        zIndex: 1050,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-8 mb-2 mb-md-0">
            <p className="mb-0">
              We use a single cookie to remember your authentication status. It
              helps keep you logged in while you use Band Manager.{" "}
              <button
                onClick={() => navigate("/legals")}
                className="btn btn-link text-light p-0 text-decoration-underline"
              >
                Learn more
              </button>
            </p>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button onClick={handleAccept} className="btn btn-primary me-2">
              Accept
            </button>
            <button onClick={handleReject} className="btn btn-outline-light">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
