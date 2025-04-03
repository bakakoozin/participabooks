import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import styles from "../../assets/style/scss/Auth.module.scss";

const pseudoRegex = /^[a-zA-Z0-9_]{3,}$/; // Au moins 3 caractères, lettres, chiffres et underscores
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format d'email basique
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Au moins 8 caractères, une lettre et un chiffre

function Register() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleChangePseudo(e) {
    const value = e.target.value;
    setPseudo(e.target.value);
    setIsPseudoValid(pseudoRegex.test(value));
  }

  function handleChangeEmail(e) {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(emailRegex.test(value));
  }

  function handleChangePassword(e) {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(passwordRegex.test(value));
  }

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

  return (
    <main id="register" className={styles.mainContainer}>
      <h1>Création du compte</h1>
      <section className={styles.authForm}> 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="pseudo"
          value={pseudo}
          onChange={handleChangePseudo}
          placeholder="Entrer votre pseudo"
          required
          />
        {!isPseudoValid && pseudo && (
          <p className={styles.authAlert}>
            Le pseudo doit contenir au moins 3 caractères, lettres, chiffres et
            underscores.
          </p>
        )}
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleChangeEmail}
          placeholder="Entrer votre email"
          required
          />
        {!isEmailValid && email && (
          <p className={styles.authAlert}>Veuillez entrer un email valide.</p>
        )}
        <input
          type="password"
          id="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="Choisir un mot de passe"
          required
          />
        {!isPasswordValid && password && (
          <p className={styles.authAlert}>
            Le mot de passe doit contenir au moins 8 caractères, une lettre et
            un chiffre.
          </p>
        )}
        <button className={styles.btn} type="submit">Créer compte</button>
        {message && <p className={styles.authAlert}>{message}</p>}
      </form>
      <p>
        Déjà inscrit ? <strong><Link to="/auth/login">Se connecter</Link></strong>
      </p>
        </section>
    </main>
  );
}

export default Register;
