import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { login } from "../../features/authSlice";
import { useTitle } from "../../hooks/useTitle";
import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Auth.module.scss";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [message, setMessage] = useState("");

  // Fonction pour gérer la soumission du formulaire de connexion
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

        const resJson = await response.json();

        if (!response.ok) {
          throw new Error(resJson.msg || "Erreur lors de la connexion.");
        }

        dispatch(login(resJson.user));
        navigate("/");
      } catch (error) {
        toast.error(error.message);
        console.error("Erreur lors de la connexion:", error);
      }
    } else {
      setMessage("Veuillez remplir tous les champs.");
    }
  }

  useTitle("Connexion");

  return (
    <main id="login" className={styles.mainContainer}>
      <h2>Se connecter</h2>
      <section className={styles.authForm}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Adresse email</label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              placeholder="Veuillez saisir votre email"
              required
              aria-required="true"
              autoComplete="email"
            />
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              placeholder="Veuillez saisir votre mot de passe"
              required
              aria-required="true"
              autoComplete="current-password"
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
      </section>
    </main>
  );
}
