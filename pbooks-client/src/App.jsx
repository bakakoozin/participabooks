import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import { AppRoutes } from "./routes/AppRoutes";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { login } from "./features/authSlice";
import { API_URL } from "./utils/constants";
import { useSession } from "./hooks/useSession";
import { toggleMenu } from "./features/menuSlice";

import styles from "./assets/style/scss/Layout.module.scss";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((state) => state.auth);
  const { isMenuOpen } = useSelector((state) => state.menu);
  useSession();

  // fonction qui permets d'affecter un "id" dynamique au <main> en fonction de la page affichée
  function handlePathname() {
    return location.pathname === "/"
      ? "home"
      : location.pathname.slice(1, location.pathname.length);
  }

  useEffect(() => {
    if (!isLogged) {
      async function checkToken() {
        const response = await fetch(`${API_URL}/auth/session`, {
          method: "GET",
          credentials: "include",
        });
        const resJSON = await response.json();
        if (response.ok) {
          dispatch(login(resJSON.user));
        }
      }
      checkToken();
    }
  }, [isLogged, dispatch]);

  return (
    <main className="App">
      <Header />
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => dispatch(toggleMenu())}
        ></div>
      )}
      <section className="container" id={handlePathname()}>
        <AppRoutes />
      </section>
      <Footer />
      <ToastContainer />
    </main>
  );
}

export default App;
