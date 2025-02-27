import Header from "./layout/Header";
import Footer from "./layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { useSession } from "./hooks/useSession";

function App() {
  useSession();
  return (
    <div className="App">
      <Header />
      <main className="container">
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
