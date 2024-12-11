import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api/userService";
import { useToast } from "../components/ToastContext";
import { availableRoles } from "../config/constants";
import { isPasswordValid } from "../utils/passwordvalidator";
import PasswordValidator from "../components/PasswordValidator";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();
  const [showLoader, setLoader] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (e.target.checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(
        selectedRoles.filter((selectedRole) => selectedRole !== role)
      );
    }
  };

  const handleSignUp = async (e) => {
    setLoader(true);
    e.preventDefault();

    if (!isPasswordValid(password, confirmPassword)) {
      showToast("Please meet all password requirements.", "error");
      setLoader(false);
      return;
    }

    try {
      const response = await userService.signUp({
        name,
        email,
        password,
        confirmPassword,
        roles: selectedRoles,
      });

      if (
        response.data.message ===
        "User created successfully. Verification code sent to email."
      ) {
        console.log("Redirecting to email verification...");
        showToast(
          "A verification code has been sent to your email.",
          "success"
        );
        navigate("/verify-email", { state: { email } });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      showToast(error.response?.data?.error || "An error occurred", "error");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-5">
      <div className="card shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-person-plus fs-2 text-primary"></i>
            </div>
            <h4 className="mb-1">Create Account</h4>
            <p className="text-muted small">
              Join us and start managing your projects
            </p>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label className="form-label text-muted small">Username</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Choose your username..."
                />
              </div>
            </div>

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

            <PasswordValidator
              password={password}
              confirmPassword={confirmPassword}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onConfirmPasswordChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <div className="mb-4">
              <label className="form-label text-muted small">
                Select Roles
              </label>
              <div className="rounded p-3 border">
                {availableRoles.map((role) => (
                  <div key={role} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={role}
                      onChange={handleRoleChange}
                    />
                    <label className="form-check-label small">
                      {role.replace("ROLE_", "").toLowerCase()}
                    </label>
                  </div>
                ))}
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
                  Creating Account...
                </button>
              ) : (
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </button>
              )}
            </div>

            <div className="text-center mt-4">
              <p className="text-muted mb-2">Already have an account?</p>
              <div
                onClick={() => navigate(`/login`)}
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
              >
                Sign In
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
