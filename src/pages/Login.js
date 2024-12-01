import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../api/loginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Form submission prevented");
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
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow w-100">
        <div className="card-body">
          <div className="w-100 text-center">
            <img src="/logo.png" alt="logo" className="img-fluid" />
          </div>
          <form onSubmit={handleLogin}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email..."
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password..."
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
