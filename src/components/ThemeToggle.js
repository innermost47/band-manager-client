import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-primary rounded-pill d-flex align-items-center"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <>
          <i className="bi bi-sun-fill me-2"></i>
          <span className="d-none d-md-inline">Light Mode</span>
        </>
      ) : (
        <>
          <i className="bi bi-moon-fill me-2"></i>
          <span className="d-none d-md-inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;