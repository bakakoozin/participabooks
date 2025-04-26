import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";

import styles from "../../assets/style/scss/Auth.module.scss";

const pseudoRegex = /^[a-zA-Z0-9_]{3,}$/; // Au moins 3 caractères, lettres, chiffres et underscores
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format d'email basique
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Au moins 8 caractères, une lettre et un chiffre

export function Register() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fonction pour gérer le changement de pseudo
  function handleChangePseudo(e) {
    const value = e.target.value;
    setPseudo(e.target.value);
    setIsPseudoValid(pseudoRegex.test(value));
  }

  // Fonction pour gérer le changement d'email
  function handleChangeEmail(e) {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value));
  }

  // Fonction pour gérer le changement de mot de passe
  function handleChangePassword(e) {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(passwordRegex.test(value));
  }

  // Fonction pour gérer la soumission du formulaire d'inscription
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isPseudoValid && isEmailValid && isPasswordValid) {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pseudo, email, password }),
        });

        const resJSON = await response.json();

        if (response.ok) {
          setMessage(resJSON.msg);
          toast.success(
            "Compte créé avec succès. Vous pouvez maintenant vous connecter."
          );
          navigate("/auth/login");
          return;
        }
        setMessage(resJSON.errors);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useTitle("Inscription");

  return (
    <main id="register" className={styles.mainContainer}>
      <h2>Création du compte</h2>
      <section className={styles.authForm}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            value={pseudo}
            onChange={handleChangePseudo}
            placeholder="Entrez votre pseudo"
            required
            aria-required="true"
            autoComplete="username"
          />
          {!isPseudoValid && pseudo && (
            <p className={styles.authAlert}>
              Le pseudo doit contenir au moins 3 caractères, lettres, chiffres
              et underscores.
            </p>
          )}
          <label htmlFor="email">Adresse email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Entrez votre email"
            required
            aria-required="true"
            autoComplete="email"
          />
          {!isEmailValid && email && (
            <p className={styles.authAlert}>Veuillez entrer un email valide.</p>
          )}
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChangePassword}
            placeholder="Choisir un mot de passe"
            required
            aria-required="true"
            autoComplete="new-password"
          />
          {!isPasswordValid && password && (
            <p className={styles.authAlert}>
              Le mot de passe doit contenir au moins 8 caractères, une lettre et
              un chiffre.
            </p>
          )}
          <button className={styles.btn} type="submit">
            Créer compte
          </button>
          {message && <p className={styles.authAlert}>{message}</p>}
        </form>
        <p>
          Déjà inscrit ?{" "}
          <strong>
            <Link to="/auth/login">Se connecter</Link>
          </strong>
        </p>
      </section>
    </main>
  );
}
