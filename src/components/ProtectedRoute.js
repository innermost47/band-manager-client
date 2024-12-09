import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
