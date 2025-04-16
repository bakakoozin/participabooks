import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../features/authSlice";
import styles from "../../assets/style/scss/Auth.module.scss";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la connexion.");
        }

        const resJson = await response.json();
        dispatch(login(resJson.user));
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        toast.error("Adresse email ou mot de passe invalide.");
      }
    } else {
      setMessage("Veuillez remplir tous les champs.");
    }
  }

  return (
    <main id="login" className={styles.mainContainer}>
      <h2>Se connecter</h2>
      <section className={styles.authForm}>
        <div className={styles.authDesktop}>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              ref={emailRef}
              placeholder="Email"
              required
            />
            <input
              type="password"
              id="password"
              ref={passwordRef}
              placeholder="Mot de passe"
              required
            />

            {message && <p className="auth-alert">{message}</p>}

            <button className={styles.btn} type="submit">
              Se connecter
            </button>
          </form>

          <p>
            Pas encore inscrit ?{" "}
            <strong>
              <Link to={"/auth/register"}>Créer un compte</Link>
            </strong>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
