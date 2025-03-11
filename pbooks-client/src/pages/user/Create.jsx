import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

function Creator() {
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
    e.preventDefault();
    const newFormData = {
      name: formData.name,
      edition: formData.edition,
      type: formData.type,
      format: formData.format,
      number: formData.number,
      title: formData.title,
      isbn: formData.isbn,
      description: formData.description,
      creator_visibility: formData.creator_visibility,
    };
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        // à modifier
        method: "POST",
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
          dispatch(login(resJSON.user)); // à modifier
          toast.success("Mise à jour réussie.");
          navigate("/dashboard"); // à modifier
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

  return (
    <>
      <h2>Créer ou mettre à jour un ouvrage</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Titre de l&apos;ouvrage</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="edition">Edition</label>
          <input
            type="text"
            id="edition"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Type d&apos;ouvrage</label>
          <div>
            <input
              type="radio"
              id="BD"
              name="type"
              value="BD"
              checked={formData.type === "BD"}
              onChange={handleChange}
            />
            <label htmlFor="choice">BD</label>
            <input
              type="radio"
              id="Livre"
              name="type"
              value="Livre"
              checked={formData.type === "Livre"}
              onChange={handleChange}
            />
            <label htmlFor="choice">Livre</label>
            <input
              type="radio"
              id="Manga"
              name="type"
              value="Manga"
              checked={formData.type === "Manga"}
              onChange={handleChange}
            />
            <label htmlFor="choice">Manga</label>
          </div>
        </div>
        <div>
          <label>Format</label>
          <div>
            <input
              type="radio"
              id="livre"
              name="format"
              value="livre"
              checked={formData.format === "livre"}
              onChange={handleChange}
            />
            <label htmlFor="choice">livre</label>
            <input
              type="radio"
              id="poche"
              name="format"
              value="poche"
              checked={formData.format === "poche"}
              onChange={handleChange}
            />
            <label htmlFor="choice">poche</label>
            <input
              type="radio"
              id="ebook"
              name="format"
              value="ebook"
              checked={formData.format === "ebook"}
              onChange={handleChange}
            />
            <label htmlFor="choice">ebook</label>
            <input
              type="radio"
              id="comics"
              name="format"
              value="comics"
              checked={formData.format === "comics"}
              onChange={handleChange}
            />
            <label htmlFor="choice">comics</label>
            <input
              type="radio"
              id="manga"
              name="format"
              value="manga"
              checked={formData.format === "manga"}
              onChange={handleChange}
            />
            <label htmlFor="choice">manga</label>
          </div>
        </div>
        <div>
          <label htmlFor="number">Numéro du volume</label>
          <input
            type="number"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="title">Titre du volume</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="isbn">ISBN</label>
          <input
            type="number"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="summary">Résumé</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="radio"
            id="creator-visibility"
            name="creator_visibility"
            value="1"
            checked={formData.format === "1"}
            onChange={handleChange}
          />
          <label htmlFor="creator_visibility">
            Je souhaite rendre mon pseudo visible en tant que créateur de ce
            volume supprimer ce mot
          </label>
        </div>
        <button type="submit">Valider</button>
      </form>
    </>
  );
}

export default Creator;
