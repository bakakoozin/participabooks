import PropTypes from "prop-types";

import styles from "../../assets/style/scss/Button.module.scss";


export function ThemeToggle({ theme, toggleTheme }) {
    return (
      <div className={styles.themeToggle}>
        <span>Mode sombre :</span>
        <div className={`${styles.toggleSwitch} ${
          theme === "sombre" ? styles.dark : styles.light
        }`} onClick={toggleTheme}>
          <div className={styles.toggleSlider} />
        </div>
      </div>
    );
  }

ThemeToggle.propTypes = {
  theme: PropTypes.string,
  toggleTheme: PropTypes.func.isRequired,
};