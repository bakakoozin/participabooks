import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { toggleMenu } from "../features/menuSlice";
import { logout } from "../features/authSlice";
import { API_URL } from "../utils/constants";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  //  function handleAvatar(user) {
  //     return user.cover_url ? `/medias/${user.avatar}` : notFoundAvatar;
  //   }

  return (
    <header className="header">
      {/* le state menu permets de gérer dynamiquement l'affichage du menu ouverture/fermeture */}
      {/* attention cependant, le responsive mobile est bon, il faudrait changer les gestionnaire d'événements "handleClick" pour qu'ils ne fonctionnent que lorsqu'on a besoin d'un menu burger...  */}
      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <NavLink to="/" end onClick={handleClick}>
          Bibliothèque Publique
        </NavLink>
        {!isLogged ? (
          <NavLink to="auth/login" end onClick={handleClick}>
            Se connecter
          </NavLink>
        ) : (
          <>
            <NavLink to="dashboard" end onClick={handleClick}>
              Profil
            </NavLink>
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        )}
      </nav>
      <div className={`burger-menu`} onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="user-infos">
      {/* <img src={handleAvatar(user)} alt="avatar" /> */}
        <p>{isLogged ? pseudo : "non connecté"}</p>
      </div>
    </header>
  );
}

export default Header;
