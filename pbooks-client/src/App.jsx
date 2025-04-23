import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

import { useSession } from "./hooks/useSession";

import { toggleMenu } from "./features/menuSlice";
import { AppRoutes } from "./routes/AppRoutes";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";

import styles from "./assets/style/scss/Layout.module.scss";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isMenuOpen } = useSelector((state) => state.menu);
  useSession();

  // fonction qui permets d'affecter un "id" dynamique au <main> en fonction de la page affichée
  function handlePathname() {
    return location.pathname === "/"
      ? "home"
      : location.pathname.slice(1, location.pathname.length);
  }

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
      <ToastContainer
      autoClose={1500}
      limit={2}
       />
    </main>
  );
}

export default App;
