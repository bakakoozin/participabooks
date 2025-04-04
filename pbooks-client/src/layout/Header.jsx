import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { toggleMenu } from "../features/menuSlice";
import { logout } from "../features/authSlice";
import { API_URL, URL_MEDIAS } from "../utils/constants";
import styles from "../assets/style/scss/Layout.module.scss";


function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      dispatch(toggleMenu());
      navigate("/");
    }
  }

  function handleClick() {
    dispatch(toggleMenu());
  }

  return (
    <header className={styles.header}>
      {/* le state menu permets de gérer dynamiquement l'affichage du menu ouverture/fermeture */}
      {/* attention cependant, le responsive mobile est bon, il faudrait changer les gestionnaire d'événements "handleClick" pour qu'ils ne fonctionnent que lorsqu'on a besoin d'un menu burger...  */}
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}>
        <button onClick={handleClick} className={styles.closeMenu}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
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
              Profil
            </NavLink>
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        )}
      </nav>
      <div className={styles.burgerMenu} onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <Link to="/" >
        <img className={styles.logo} src="/logo_pbooks_light.png" alt="Logo de participabooks" />
      </Link>
      <div className={styles.userInfos}>
        <p>{isLogged ? infos.pseudo : "non connecté"}</p>
        {!isLogged || (infos.avatar === null) ? (
          <FontAwesomeIcon icon={faCircleUser} />
        ) : (
          <img src={`${URL_MEDIAS}avatars/${infos.avatar}`} alt={pseudo} />
        )}
      </div>
    </header>
  );
}

export default Header;
