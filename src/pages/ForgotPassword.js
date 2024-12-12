import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import { loginService } from "../api/loginService";
import { isPasswordValid } from "../utils/passwordvalidator";
import PasswordValidator from "../components/PasswordValidator";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoader(true);
    if (!email) {
      showToast("Email is required", "error");
      setLoader(false);
      return;
    }

    try {
      const response = await loginService.forgotPassword({
        email,
      });
      showToast("Verification code has been sent to your email", "success");
      setStep(2);
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            showToast(
              error.response.data.error || "Invalid email format",
              "error"
            );
            break;
          case 404:
            showToast("Account not found", "error");
            break;
          case 429:
            showToast("Too many attempts. Please try again later", "error");
            break;
          default:
            showToast(
              error.response.data.error || "Failed to send verification code",
              "error"
            );
        }
      } else if (error.request) {
        showToast(
          "Unable to connect to the server. Please check your internet connection",
          "error"
        );
      } else {
        showToast("An unexpected error occurred", "error");
      }
    } finally {
      setLoader(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoader(true);

    if (!code || !newPassword) {
      showToast("Verification code and new password are required", "error");
      setLoader(false);
      return;
    }

    if (!isPasswordValid(newPassword, confirmPassword)) {
      showToast("Please meet all password requirements", "error");
      setLoader(false);
      return;
    }

    try {
      const response = await loginService.resetPassword({
        email,
        code,
        password: newPassword,
      });
      showToast("Password reset successfully", "success");
      navigate("/login", {
        state: {
          message:
            "Your password has been reset successfully. Please login with your new password.",
        },
      });
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            showToast(
              error.response.data.error || "Invalid code or password format",
              "error"
            );
            break;
          case 401:
            showToast("Invalid verification code", "error");
            break;
          case 429:
            showToast("Too many attempts. Please try again later", "error");
            break;
          default:
            showToast(
              error.response.data.error || "Failed to reset password",
              "error"
            );
        }
      } else if (error.request) {
        showToast(
          "Unable to connect to the server. Please check your internet connection",
          "error"
        );
      } else {
        showToast("An unexpected error occurred", "error");
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-5">
      <div className="card shadow-sm w-100" style={{ maxWidth: "400px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "64px",
                height: "64px",
                minWidth: "64px",
              }}
            >
              <i className="bi bi-key fs-2 text-primary"></i>
            </div>
            <h4 className="mb-1">Forgot Password?</h4>
            <p className="text-muted small">
              {step === 1
                ? "Enter your email address to receive a verification code"
                : "Enter the verification code and your new password"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleRequestCode}>
              <div className="mb-4">
                <label className="form-label text-muted small">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope text-primary"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email..."
                  />
                </div>
              </div>

              <div className="d-grid">
                {showLoader ? (
                  <button
                    className="btn btn-primary py-2"
                    type="button"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending Code...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary py-2">
                    <i className="bi bi-envelope-paper me-2"></i>
                    Send Verification Code
                  </button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label text-muted small">
                  Verification Code
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-shield-lock text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Enter verification code..."
                  />
                </div>
              </div>

              <PasswordValidator
                password={newPassword}
                confirmPassword={confirmPassword}
                onPasswordChange={(e) => setNewPassword(e.target.value)}
                onConfirmPasswordChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <div className="d-grid">
                {showLoader ? (
                  <button
                    className="btn btn-primary py-2"
                    type="button"
                    disabled
                  >
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Resetting Password...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary py-2">
                    <i className="bi bi-check2 me-2"></i>
                    Reset Password
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="text-center mt-4">
            <p className="text-muted mb-2">Remember your password?</p>
            <div
              onClick={() => navigate("/login")}
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
            >
              Back to Login
            </div>
          </div>

          <div className="text-center mt-4 pt-3 border-top">
            <a
              href="/legals"
              className="text-decoration-none small text-muted"
              onClick={(e) => {
                e.preventDefault();
                navigate("/legals");
              }}
            >
              Legal Terms & Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
