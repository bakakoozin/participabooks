import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const minAliasLength = 3;
const minPasswordLength = 8;

function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPseudoValid, setIsPseudoValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleChangePseudo(e) {
    setPseudo(e.target.value);
    if (e.target.value.length < minAliasLength) {
      setIsPseudoValid(false);
    } else {
      setIsPseudoValid(true);
    }
  }

  function handleChangeEmail(e) {
    setEmail(e.target.value);
    if (e.target.value.includes("@")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
    if (e.target.value.length < minPasswordLength) {
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
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
    <main id="register">
      <h1>Création du compte</h1>
      <form onSubmit={handleSubmit} className="auth">
        <input
          type="text"
          id="pseudo"
          value={pseudo}
          onChange={handleChangePseudo}
          placeholder="Entrer votre pseudo"
          required
        />
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleChangeEmail}
          placeholder="Entrer votre email"
          required
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="Choisir un mot de passe"
          required
        />
        <button type="submit">Créer compte</button>
        {message && <p className="auth-alert">{message}</p>}
      </form>
      <p>
        Déjà inscrit ? <Link to="/auth/login">Se connecter</Link>
      </p>
      {/* <aside className="validation password">
				<p>Le pseudo doit contenir :</p>
				<ul>
					<li className={!isPseudoValid ? "alert" : "success"}>
						{minPseudolength} caractères minimum
					</li>
				</ul>
				<p>Le mot de passe doit contenir :</p>
				<ul>
					<li className={!isPasswordValid ? "alert" : "success"}>
						{minPasswordlength} caractères minimum
					</li>
				</ul>
			</aside> */}
    </main>
  );
}

export default Register;
