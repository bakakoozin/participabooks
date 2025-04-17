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
      <div className={styles.footerLinks}>
        <NavLink to="CGU" end className={styles.footerLink}>
          CGU
        </NavLink>
        <NavLink to="Legal" end lassName={styles.footerLink}>
          Mentions Légales
        </NavLink>
      </div>
    </footer>
  );
}
