import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userService } from "../api/userService";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showLoader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await userService.verifyEmail({
        email,
        code: verificationCode,
      });

      if (response.data.message === "Email verified successfully.") {
        console.log("Email verification successful, redirecting to login...");
        setMessage("Your email has been verified successfully. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setError(error.response?.data?.error || "Invalid verification code");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-5">
      <div className="card shadow-sm" style={{ maxWidth: "450px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-envelope-check fs-2 text-primary"></i>
            </div>
            <h4 className="mb-2">Email Verification</h4>
            <p className="text-muted small">
              Please enter the verification code sent to{" "}
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}
            {message && (
              <div className="alert alert-success d-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                {message}
              </div>
            )}

            <div className="mb-4">
              <label className="form-label text-muted small">
                Verification Code
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-key text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  placeholder="Enter verification code..."
                  maxLength="6"
                />
              </div>
            </div>

            <div className="d-grid">
              {showLoader ? (
                <button className="btn btn-primary py-2" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </button>
              ) : (
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-check-circle me-2"></i>
                  Verify Email
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;