import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { API_URL, URL_MEDIAS } from "../utils/constants";
import { toggleMenu } from "../features/menuSlice";
import { logout } from "../features/authSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../assets/style/scss/Layout.module.scss";
import { useState } from "react";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState("/logo_pbooks_light.png");
  const { infos } = useSelector((state) => state.auth);
  const { isLogged, pseudo } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.menu);

  async function handleLogout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      dispatch(logout());
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        dispatch(toggleMenu());
      }
      navigate("/");
    }
  }

  const defaultLogo = "/logo_pbooks_light.png";
  const hoverLogo = "/logo_pbooks_dark.png";
  const clickedLogo = "/logo_pbooks_dark.png";

  function handleClick() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      dispatch(toggleMenu());
    }
  }

  function handleMouseEnter() {
    setLogoSrc(hoverLogo);
  }

  function handleMouseLeave() {
    setLogoSrc(defaultLogo);
  }

  function handleClickLogo() {
    setLogoSrc(clickedLogo);

    setTimeout(() => {
      setLogoSrc(defaultLogo);
    }, 300);
  }

  return (
    <header className={styles.header}>
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
        {isMenuOpen && (
          <button onClick={handleClick} className={styles.closeMenu}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <NavLink to="/" end onClick={handleClick}>
          Bibliothèque
        </NavLink>
        {!isLogged ? (
          <NavLink to="auth/login" end onClick={handleClick}>
            Se connecter
          </NavLink>
        ) : (
          <>
            <NavLink to="shelf" end onClick={handleClick}>
              Ma bibliothèque
            </NavLink>
            <NavLink to="creator" end onClick={handleClick}>
              Créer
            </NavLink>
            <NavLink to="dashboard" end onClick={handleClick}>
              Mon Profil
            </NavLink>
            {infos.role === "admin" && (
              <NavLink
                to="admin"
                end
                onClick={handleClick}
                className={styles.adminLink}
              >
                Admin
              </NavLink>
            )}
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        )}
      </nav>
      <div className={styles.burgerMenu} onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <Link to="/">
        <img
          className={styles.logo}
          src={logoSrc}
          alt="Logo de participabooks"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClickLogo}
        />
      </Link>
      <div className={styles.userInfos}>
        <p>{isLogged ? infos.pseudo : "non connecté"}</p>
        {!isLogged || infos.avatar === null ? (
          <FontAwesomeIcon icon={faCircleUser} />
        ) : (
          <img src={`${URL_MEDIAS}avatars/${infos.avatar}`} alt={pseudo} />
        )}
      </div>
    </header>
  );
}
