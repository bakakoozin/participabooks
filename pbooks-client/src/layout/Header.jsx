import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { toggleMenu } from "../features/menuSlice";

function Header() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const cart = useSelector((state) => state.cart);
  const { isLogged } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.menu);

function handleClick() {
    dispatch(toggleMenu());
}

  return (
    <header className="header">
      <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
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
    </header>
  );
}

export default Header;
