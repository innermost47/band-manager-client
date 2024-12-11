import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import SongDetails from "./pages/SongDetails";
import Login from "./pages/Login";
import ManageTablature from "./pages/ManageTablature";
import ProtectedRoute from "./components/ProtectedRoute";
import AdministrativeTasks from "./pages/AdministrativeTasks";
import AdministrativeTaskDetails from "./pages/AdministrativeTaskDetails";
import Verify2FA from "./pages/Verify2FA";
import UserProfile from "./pages/UserProfile";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ProjectPublicProfile from "./pages/ProjectPublicProfile";
import PublicUserProfile from "./pages/PublicUserProfile";
import PublicProfiles from "./pages/PublicProfiles";
import Legals from "./pages/Legals";
import Layout from "./components/Layout";
import CookieConsent from "./components/CookieConsent";
import { setNavigationCallback } from "./api/api";
import { useEffect } from "react";
import { ToastProvider } from "./components/ToastContext";

const DefaultRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const PublicLayout = ({ children }) => (
  <ToastProvider>
    {children}
    <CookieConsent />
  </ToastProvider>
);

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback((options) => navigate("/login", options));
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<DefaultRoute />} />

      {/* Routes publiques sans Layout */}
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicLayout>
            <SignUp />
          </PublicLayout>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicLayout>
            <VerifyEmail />
          </PublicLayout>
        }
      />
      <Route
        path="/verify-2fa"
        element={
          <PublicLayout>
            <Verify2FA />
          </PublicLayout>
        }
      />

      {/* Route légale avec Layout mais sans Navbar */}
      <Route
        path="/legals"
        element={
          <Layout>
            <Legals />
          </Layout>
        }
      />

      {/* Routes protégées avec Layout et Navbar */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={Dashboard} />
          </Layout>
        }
      />
      <Route
        path="/projects"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={Projects} />
          </Layout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={ProjectDetails} />
          </Layout>
        }
      />
      <Route
        path="/songs/:id"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={SongDetails} />
          </Layout>
        }
      />
      <Route
        path="/tablatures/update/:tabId/:songId"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={ManageTablature} />
          </Layout>
        }
      />
      <Route
        path="/tablatures/create/:songId"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={ManageTablature} />
          </Layout>
        }
      />
      <Route
        path="/administrative-tasks"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={AdministrativeTasks} />
          </Layout>
        }
      />
      <Route
        path="/public-projects/:id"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={ProjectPublicProfile} />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={UserProfile} />
          </Layout>
        }
      />
      <Route
        path="/public-profile/:id"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={PublicUserProfile} />
          </Layout>
        }
      />
      <Route
        path="/profiles"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={PublicProfiles} />
          </Layout>
        }
      />
      <Route
        path="/administrative-tasks/:adminTaskId"
        element={
          <Layout>
            <Navbar />
            <ProtectedRoute component={AdministrativeTaskDetails} />
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
export default App;
