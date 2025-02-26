import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import { toggleMenu } from "../features/menuSlice";
// import useCloseMenu from "../hooks/useCloseMenu";

function Header() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const cart = useSelector((state) => state.cart);
  const { isLogged } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.menu);

  // useCloseMenu();

  function handleClick() {
    dispatch(toggleMenu());
}

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
            Connexion
          </NavLink>
        ) : (
          <>
            <NavLink to="dashboard" end onClick={handleClick}>
              Profil
            </NavLink>
            {/* <button onClick={handleLogout}>Déconnexion</button> */}
          </>
        )}
      </nav>
      <div className={`burger-menu`} onClick={handleClick}>
        <FontAwesomeIcon icon={faBars} />
      </div>
    </header>
  );
}

export default Header;
