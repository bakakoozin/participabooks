import PropTypes from "prop-types";

export function ThemeToggle({ theme, toggleTheme }) {
    return (
      <div className="theme-toggle">
        <span>Mode sombre :</span>
        <div className={`toggle-switch ${theme === "sombre" ? "dark" : "light"}`} onClick={toggleTheme}>
          <div className="toggle-slider" />
        </div>
      </div>
    );
  }

ThemeToggle.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func.isRequired,
};