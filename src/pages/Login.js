import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../api/loginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      setLoader(false);
      return;
    }

    try {
      const response = await loginService.login({
        email,
        password,
      });
      if (response.data.message === "Verification code sent to your email.") {
        console.log("Redirecting to 2FA verification...");
        navigate("/verify-2fa", { state: { email } });
      } else {
        console.log("Login successful, navigating to dashboard...");
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError(
              error.response.data.error || "Invalid email or password format"
            );
            break;
          case 401:
            setError(error.response.data.error || "Invalid credentials");
            break;
          case 404:
            setError("Account not found");
            break;
          case 429:
            setError("Too many attempts. Please try again later");
            break;
          default:
            setError(
              error.response.data.error || "An error occurred during login"
            );
        }
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check your internet connection"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-5">
      <div className="card shadow-sm" style={{ maxWidth: "400px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img src="/logo.png" alt="logo" className="w-75 mb-3" />
            <h4 className="mb-1">Welcome Back!</h4>
            <p className="text-muted small">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <div className="mb-3">
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

            <div className="mb-4">
              <label className="form-label text-muted small">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock text-primary"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password..."
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
                  Signing in...
                </button>
              ) : (
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </button>
              )}
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted mb-2">Don't have an account?</p>
            <div
              onClick={() => navigate(`/signup`)}
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
            >
              Create Account
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

export default Login;
