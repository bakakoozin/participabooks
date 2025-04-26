import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { API_URL, URL_MEDIAS } from "../utils/constants";
import { toggleMenu } from "../features/menuSlice";
import { logout } from "../features/authSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../assets/style/scss/Layout.module.scss";
import {
  faBars,
  faXmark,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infos } = useSelector((state) => state.auth);
  const { isLogged } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.menu);
  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") || "clair";

  // Affichage du logo par défaut
  const getDefaultLogo = (theme) =>
    theme === "sombre" ? "/logo_pbooks_light.png" : "/logo_pbooks_dark.png";

  const getHoverLogo = (theme) =>
    theme === "sombre" ? "/logo_pbooks_dark.png" : "/logo_pbooks_light.png";

  const [theme, setTheme] = useState(getTheme());
  const [logoSrc, setLogoSrc] = useState(getDefaultLogo(theme));

  const hoverLogo = getHoverLogo(theme);
  const clickedLogo = hoverLogo;
  const defaultLogo = getDefaultLogo(theme);

  // Fonction pour gérer la déconnexion
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

  // Fonction pour gérer l'ouverture et la fermeture du menu
  function handleClick() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      dispatch(toggleMenu());
    }
  }

  // Fonction pour gérer le survol du logo
  function handleMouseEnter() {
    setLogoSrc(hoverLogo);
  }

  function handleMouseLeave() {
    setLogoSrc(defaultLogo);
  }

  // Fonction pour gérer le clic sur le logo
  function handleClickLogo() {
    setLogoSrc(clickedLogo);

    setTimeout(() => {
      setLogoSrc(defaultLogo);
    }, 300);
  }

  // Fonction pour surveiller le changement de thème
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = getTheme();
      setTheme(newTheme);
      setLogoSrc(getDefaultLogo(newTheme));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.header}>
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
        {isMenuOpen && (
          <button onClick={handleClick} className={styles.closeMenu}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <NavLink
          to="/"
          end
          onClick={handleClick}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          Bibliothèque
        </NavLink>
        {!isLogged ? (
          <NavLink
            to="auth/login"
            end
            onClick={handleClick}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Se connecter
          </NavLink>
        ) : (
          <>
            <NavLink
              to="shelf"
              end
              onClick={handleClick}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Ma bibliothèque
            </NavLink>
            <NavLink
              to="creator"
              end
              onClick={handleClick}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Créer
            </NavLink>
            <NavLink
              to="dashboard"
              end
              onClick={handleClick}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Mon Profil
            </NavLink>
            {infos.role === "admin" && (
              <NavLink
                to="admin"
                end
                onClick={handleClick}
                className={({ isActive }) =>
                  `${styles.adminLink} ${styles.navLink} ${
                    isActive ? styles.active : ""
                  }`
                }
              >
                Admin
              </NavLink>
            )}
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        )}
        <div className={styles.legalLinkContainer}>
          <NavLink
            to="CGU"
            end
            onClick={handleClick}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            CGU
          </NavLink>
          <NavLink
            to="Legal"
            end
            onClick={handleClick}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Mentions Légales
          </NavLink>
        </div>
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
          <img
            src={`${URL_MEDIAS}avatars/${infos.avatar}`}
            alt={`avatar de ${infos.pseudo}`}
          />
        )}
      </div>
    </header>
  );
}
