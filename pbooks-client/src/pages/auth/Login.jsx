import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { TOKEN } from "../../utils/constants";
import { toast } from "react-toastify";

function Login() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (email.length && password.length) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la connexion.");
        }

        const resJson = await response.json();

        localStorage.setItem(TOKEN, resJson.token);
        navigate("/");
      } catch {
        toast.error("Erreur lors de la connexion.");
      }
    } else {
      setMessage("Veuillez remplir tous les champs.");
    }
  }

  return (
    <main id="login">
      <h1>Se connecter</h1>
      <form onSubmit={handleSubmit} className="auth">
        <input
          type="email"
          id="email"
          ref={emailRef}
          placeholder="Entrer votre email"
        />
        <input
          type="password"
          id="password"
          ref={passwordRef}
          placeholder="Entrer votre mot de passe"
        />

        {message && <p className="auth-alert">{message}</p>}

        <button type="submit">Se connecter</button>
      </form>
      <p>
        Pas encore inscrit ? <Link to={"/auth/register"}>Créer un compte</Link>
      </p>
    </main>
  );
}

export default Login;
