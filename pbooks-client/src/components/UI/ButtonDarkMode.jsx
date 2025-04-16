import PropTypes from "prop-types";

import styles from "../../assets/style/scss/Button.module.scss";
import { useState } from "react";
import { API_URL } from "../../utils/constants";


export function ThemeToggle({ defaultTheme }) {
  const [theme, setTheme] = useState(defaultTheme);

    async function handleThemeChange(newTheme) {
      document.documentElement.setAttribute("data-theme", newTheme);
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
          setTheme(resJSON.theme);
        } else {
          console.error("Échec de la mise à jour du thème. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du thème.", error);
      }
    }

  function toggleTheme() {
      const newTheme = theme === "clair" ? "sombre" : "clair";
  
      if (newTheme === "sombre") {
        document.documentElement.classList.add("dark-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
      }
  
      handleThemeChange(newTheme);
      console.log("newTheme", newTheme);
    }

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
  defaultTheme: PropTypes.string,
};