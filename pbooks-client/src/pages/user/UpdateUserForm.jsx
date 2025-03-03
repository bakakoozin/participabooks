import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

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

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    const newFormData = {
      pseudo: formData.pseudo,
      email: formData.email,
      password: formData.password,
    };
    e.preventDefault();
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
        toast.error("Échec de la mise à jour. Veuillez réessayer.");
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
        </div>
        <div>
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            id="passwordCheck"
            name="passwordCheck"
            value={formData.passwordCheck}
            onChange={handleChange}
            placeholder="Confirmer votre mot de passe"
          />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </>
  );
}

export default UpdateUserForm;
