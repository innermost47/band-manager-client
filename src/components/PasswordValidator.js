import { useState } from "react";

const PasswordValidator = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  showConfirmPassword = true,
}) => {
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    alphaNumeric: false,
    specialCharacter: false,
    match: false,
  });

  const validatePassword = (password, confirmPass) => {
    const validation = {
      length: password.length >= 8,
      alphaNumeric: /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password),
      specialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPass,
    };
    setPasswordValidation(validation);
    return validation;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    validatePassword(value, confirmPassword);
    onPasswordChange(e);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    validatePassword(password, value);
    onConfirmPasswordChange(e);
  };

  return (
    <>
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
            placeholder="Enter password..."
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
                passwordValidation.length ? "bi-check-circle" : "bi-x-circle"
              } me-2`}
            ></i>
            At least 8 characters
          </li>
          <li
            className={
              passwordValidation.alphaNumeric ? "text-success" : "text-danger"
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

      {showConfirmPassword && (
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
      )}
    </>
  );
};

export default PasswordValidator;
