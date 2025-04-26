import { NavLink, useLocation } from "react-router-dom";

import { ButtonReturn } from "../components/UI/ButtonReturn";

import styles from "../assets/style/scss/Layout.module.scss";

export function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <footer className={styles.footer}>
      {!isHome && (
        <div className={styles.footerBtnReturnWrapper}>
          <ButtonReturn className={styles.footerBtnReturn} />
        </div>
      )}
      <p>&copy; 2025 - Baka Dev - Participabooks</p>
      <nav aria-label="Liens légaux" className={styles.footerLinkContainer}>
        <NavLink
          to="cgu"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          CGU
        </NavLink>
        <NavLink
          to="legal"
          end
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Mentions Légales
        </NavLink>
      </nav>
    </footer>
  );
}
