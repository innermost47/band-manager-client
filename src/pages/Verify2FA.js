import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../api/loginService";
import { useToast } from "../components/ToastContext";

const Verify2FA = () => {
  const [code, setCode] = useState("");
  const { showToast } = useToast();
  const [showLoader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await loginService.verify2FA({ email, code });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      showToast(error.response?.data?.error || "An error occurred", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-5">
      <div className="card shadow-sm w-100" style={{ maxWidth: "450px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-shield-lock fs-2 text-primary"></i>
            </div>

            <h4 className="mb-2">Two-Factor Authentication</h4>
            <p className="text-muted small">
              Please enter the verification code sent to your email to continue
            </p>
          </div>

          <form onSubmit={handleVerify}>
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
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="Enter code..."
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
                  <i className="bi bi-shield-check me-2"></i>
                  Verify Code
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;
