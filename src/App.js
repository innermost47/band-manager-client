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
import ForgotPassword from "./pages/ForgotPassword";
import JoinProjectPage from "./pages/JoinProject";
import { ThemeProvider } from "./components/ThemeContext";
import NotFound from "./components/NotFound";
import Events from "./pages/Events";
import PublicMusicLibrary from "./pages/PublicMusicLibrary";

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

const PrivateLayout = ({ children }) => {
  return (
    <Layout>
      <Navbar />
      {children}
    </Layout>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback((options) => navigate("/login", options));
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<DefaultRoute />} />

      <Route
        path="/forgot-password"
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />
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
          <PrivateLayout>
            <ProtectedRoute component={Dashboard} />
          </PrivateLayout>
        }
      />
      <Route
        path="/join-project"
        element={
          <PrivateLayout>
            <ProtectedRoute component={JoinProjectPage} />
          </PrivateLayout>
        }
      />
      <Route
        path="/projects"
        element={
          <PrivateLayout>
            <ProtectedRoute component={Projects} />
          </PrivateLayout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <PrivateLayout>
            <ProtectedRoute component={ProjectDetails} />
          </PrivateLayout>
        }
      />
      <Route
        path="/songs/:id"
        element={
          <PrivateLayout>
            <ProtectedRoute component={SongDetails} />
          </PrivateLayout>
        }
      />
      <Route
        path="/tablatures/update/:tabId/:songId"
        element={
          <PrivateLayout>
            <ProtectedRoute component={ManageTablature} />
          </PrivateLayout>
        }
      />
      <Route
        path="/tablatures/create/:songId"
        element={
          <PrivateLayout>
            <ProtectedRoute component={ManageTablature} />
          </PrivateLayout>
        }
      />
      <Route
        path="/administrative-tasks"
        element={
          <PrivateLayout>
            <ProtectedRoute component={AdministrativeTasks} />
          </PrivateLayout>
        }
      />
      <Route
        path="/public-projects/:id"
        element={
          <PrivateLayout>
            <ProtectedRoute component={ProjectPublicProfile} />
          </PrivateLayout>
        }
      />
      <Route
        path="/music-library"
        element={
          <PrivateLayout>
            <ProtectedRoute component={PublicMusicLibrary} />
          </PrivateLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateLayout>
            <ProtectedRoute component={UserProfile} />
          </PrivateLayout>
        }
      />
      <Route
        path="/public-profile/:id"
        element={
          <PrivateLayout>
            <ProtectedRoute component={PublicUserProfile} />
          </PrivateLayout>
        }
      />
      <Route
        path="/profiles"
        element={
          <PrivateLayout>
            <ProtectedRoute component={PublicProfiles} />
          </PrivateLayout>
        }
      />
      <Route
        path="/events"
        element={
          <PrivateLayout>
            <ProtectedRoute component={Events} />
          </PrivateLayout>
        }
      />
      <Route
        path="/administrative-tasks/:adminTaskId"
        element={
          <PrivateLayout>
            <ProtectedRoute component={AdministrativeTaskDetails} />
          </PrivateLayout>
        }
      />
      <Route
        path="*"
        element={
          <PrivateLayout>
            {localStorage.getItem("token") ? (
              <ProtectedRoute component={NotFound} />
            ) : (
              <NotFound />
            )}
          </PrivateLayout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}
export default App;
