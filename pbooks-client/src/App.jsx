import { useLocation } from "react-router-dom";

import Header from "./layout/Header";
import Footer from "./layout/Footer";
// import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();
  // const dispatch = useDispatch();
  // const cart = useSelector((state) => state.cart);
  // const isLogged = useSelector((state) => state.auth);

  function handlePathname() {
    return location.pathname === "/"
      ? "home"
      : location.pathname.slice(1, location.pathname.length);
  }

  return (
    <div className="App">
      <Header />
      <main className="container" id={handlePathname()}>
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;
