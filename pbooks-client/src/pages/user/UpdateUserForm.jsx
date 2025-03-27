import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

const pseudoRegex = /^[a-zA-Z0-9_]{3,}$/; // Au moins 3 caractères, lettres, chiffres et underscores
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format d'email basique
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Au moins 8 caractères, une lettre et un chiffre

function UpdateUserForm() {
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
        toast.error(resJSON.message || "Échec de la mise à jour. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
      setMessage("Erreur s'est produite. Veuillez réessayer.");
    }
  }

  return (
    <>
      <h2>Modifier mes informations</h2>

{message && <p>{message}</p>}

<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="pseudo">Nouveau pseudo</label>
    <input
      type="text"
      id="pseudo"
      name="pseudo"
      value={formData.pseudo}
      onChange={handleChange}
    />
    {!isPseudoValid && formData.pseudo && (
      <p className="auth-alert">Le pseudo doit contenir au moins 3 caractères, lettres, chiffres et underscores.</p>
    )}
  </div>
  <div>
    <label htmlFor="email">Nouvel email</label>
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
  <button type="submit">Mettre à jour</button>

  <h2>Changer mot de passe</h2>
</form>
<form onSubmit={handleSubmit}>
  <div>
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
      <p className="auth-alert">Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.</p>
    )}
  </div>
  <button type="submit">Valider</button>
</form>
    </>
  );
}

export default UpdateUserForm;
