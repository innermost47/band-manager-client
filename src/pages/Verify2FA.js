import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../api/loginService";

const Verify2FA = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await loginService.verify2FA({ email, code });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Verify 2FA</h2>
      <form onSubmit={handleVerify} className="mt-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Verification Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Verify
        </button>
      </form>
    </div>
  );
};

export default Verify2FA;
