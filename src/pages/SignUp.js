import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api/userService";
import { useToast } from "../components/ToastContext";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();
  const [showLoader, setLoader] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alphaNumeric: false,
    specialCharacter: false,
    match: false,
  });
  const [selectedRoles, setSelectedRoles] = useState([]);

  const navigate = useNavigate();

  const validatePassword = (password, confirmPassword) => {
    setPasswordValidation({
      length: password.length >= 8,
      alphaNumeric: /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password),
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword,
    });
  };

  const availableRoles = [
    "ROLE_GUITARIST",
    "ROLE_ARRANGEUR",
    "ROLE_SINGER",
    "ROLE_DRUMMER",
    "ROLE_MANAGER",
    "ROLE_BASSIST",
  ];

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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validatePassword(password, value);
  };

  const handleSignUp = async (e) => {
    setLoader(true);
    e.preventDefault();
    const { length, alphaNumeric, specialCharacter, match } =
      passwordValidation;
    if (!length || !alphaNumeric || !specialCharacter || !match) {
      showToast("Please meet all password requirements.", "error");
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

            <div className="mb-3">
              <label className="form-label text-muted small">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock text-primary"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Create password..."
                />
              </div>
              <ul className="list-unstyled mt-2 small">
                <li
                  className={
                    passwordValidation.length ? "text-success" : "text-danger"
                  }
                >
                  <i
                    className={`bi ${
                      passwordValidation.length
                        ? "bi-check-circle"
                        : "bi-x-circle"
                    } me-2`}
                  ></i>
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordValidation.alphaNumeric
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  <i
                    className={`bi ${
                      passwordValidation.alphaNumeric
                        ? "bi-check-circle"
                        : "bi-x-circle"
                    } me-2`}
                  ></i>
                  Contains letters and numbers
                </li>
                <li
                  className={
                    passwordValidation.specialCharacter
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  <i
                    className={`bi ${
                      passwordValidation.specialCharacter
                        ? "bi-check-circle"
                        : "bi-x-circle"
                    } me-2`}
                  ></i>
                  Contains at least one special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small">
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill text-primary"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  placeholder="Confirm your password..."
                />
              </div>
              <div
                className={`small mt-2 ${
                  passwordValidation.match ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`bi ${
                    passwordValidation.match ? "bi-check-circle" : "bi-x-circle"
                  } me-2`}
                ></i>
                {passwordValidation.match
                  ? "Passwords match"
                  : "Passwords do not match"}
              </div>
            </div>

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
