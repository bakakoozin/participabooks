import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Button.module.scss";
import { useSelector } from "react-redux";
import { setTheme } from "../../features/authSlice";

const LS_THEME = "pb_theme";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.auth.infos);

  async function handleThemeChange(newTheme) {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem(LS_THEME, newTheme);

    try {
      const response = await fetch(`${API_URL}/user/profile/theme`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme }),
        credentials: "include",
      });

      if (response.ok) {
        const resJSON = await response.json();
        dispatch(setTheme(resJSON.theme));
      } else {
        console.error("Échec de la mise à jour du thème. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du thème.", error);
    }
  }

  function toggleTheme() {
    const newTheme = theme === "clair" ? "sombre" : "clair";
    handleThemeChange(newTheme);
  }

  return (
    <div className={styles.themeToggle}>
      <span>Mode sombre :</span>
      <div
        role="switch"
        aria-checked={theme === "sombre"}
        aria-label={`Activer le mode ${
          theme === "sombre" ? "clair" : "sombre"
        }`}
        className={`${styles.toggleSwitch} ${
          theme === "sombre" ? styles.dark : styles.light
        }`}
        onClick={toggleTheme}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggleTheme();
        }}
      >
        <div className={styles.toggleSlider} />
      </div>
    </div>
  );
}

ThemeToggle.propTypes = {
  defaultTheme: PropTypes.string,
};
