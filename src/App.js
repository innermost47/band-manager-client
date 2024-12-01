import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import SongDetails from "./pages/SongDetails";
import Login from "./pages/Login";
import ManageTablature from "./pages/ManageTablature";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={Dashboard} />
            </>
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={Projects} />
            </>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={ProjectDetails} />
            </>
          }
        />
        <Route
          path="/songs/:id"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={SongDetails} />
            </>
          }
        />
        <Route
          path="/tablatures/update/:tabId/:songId"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={ManageTablature} />
            </>
          }
        />
        <Route
          path="/tablatures/create/:songId"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={ManageTablature} />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <Navbar />
              <ProtectedRoute component={Users} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
