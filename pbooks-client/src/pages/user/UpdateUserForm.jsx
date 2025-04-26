import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

import { login } from "../../features/authSlice";
import { useTitle } from "../../hooks/useTitle";
import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Form.module.scss";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Au moins 8 caractères, une lettre et un chiffre
const pseudoRegex = /^[a-zA-Z0-9_]{3,}$/; // Au moins 3 caractères, lettres, chiffres et underscores
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format d'email basique

export function UpdateUserForm() {
  const { infos } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pseudo: infos.pseudo || "",
    email: infos.email || "",
    password: "",
    passwordCheck: "",
  });

  const [isPseudoValid, setIsPseudoValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [message, setMessage] = useState("");

  //Fonction pour gérer les changements dans les champs du formulaire
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "pseudo") {
      setIsPseudoValid(pseudoRegex.test(value));
    } else if (name === "email") {
      setIsEmailValid(emailRegex.test(value));
    } else if (name === "password") {
      setIsPasswordValid(passwordRegex.test(value));
    }
  }

  // Fonction pour gérer la soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isPseudoValid || !isEmailValid || !isPasswordValid) {
      toast.error("Veuillez remplir correctement tous les champs.");
      return;
    }
    if (formData.password !== formData.passwordCheck) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    const newFormData = {
      pseudo: formData.pseudo,
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newFormData),
      });

      if (response.ok) {
        const checkSession = await fetch(`${API_URL}/auth/session`, {
          method: "GET",
          credentials: "include",
        });
        if (checkSession.ok) {
          const resJSON = await checkSession.json();
          dispatch(login(resJSON.user));
          toast.success("Mise à jour réussie.");
          navigate("/dashboard");
        } else {
          toast.error(
            "Échec de la vérification de la session. Veuillez réessayer."
          );
        }
      } else {
        const resJSON = await response.json();
        toast.error(
          resJSON.message || "Échec de la mise à jour. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
      setMessage("Erreur s'est produite. Veuillez réessayer.");
    }
  }

  useTitle("Mise à jour de mes informations");

  return (
    <main className={styles.mainContainer}>
      <section className={styles.formCard}>
        <h3>Modifier mes informations</h3>

        {message && <p>{message}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="pseudo">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
          />
          {!isPseudoValid && formData.pseudo && (
            <p className="auth-alert">
              Le pseudo doit contenir au moins 3 caractères, lettres, chiffres
              et underscores.
            </p>
          )}
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {!isEmailValid && formData.email && (
              <p className="auth-alert">Veuillez entrer un email valide.</p>
            )}
          </div>
          <button
            className={styles.btn}
            type="submit"
            aria-label="Mettre à jour mes informations"
          >
            Mettre à jour
          </button>
          <hr className={styles.separator} />
          <h3>Changer mot de passe</h3>
        </form>
        <form onSubmit={handleSubmit}>
          <div className={styles.formPassword}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
            />
            <input
              type="password"
              id="passwordCheck"
              name="passwordCheck"
              value={formData.passwordCheck}
              onChange={handleChange}
              placeholder="Confirmer nouveau mot de passe"
            />
            {!isPasswordValid && formData.password && (
              <p className="auth-alert">
                Le mot de passe doit contenir au moins 8 caractères, une lettre
                et un chiffre.
              </p>
            )}
          </div>
          <div className={styles.validateContainer}>
            <button
              className={styles.btn}
              type="submit"
              aria-label="Valider la mise à jour du mot de passe"
            >
              Valider
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={() => navigate(-1)}
              aria-label="Annuler la mise à jour"
            >
              Annuler
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
