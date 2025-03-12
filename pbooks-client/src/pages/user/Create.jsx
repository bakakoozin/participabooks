import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

function Creator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    edition: "",
    type: "",
    format: "",
    number: "",
    title: "",
    isbn: "",
    summary: "",
    creator_visibility: false, // Mettre à jour l'état pour la case à cocher
    media: null,
    authors: [""],
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value, checked, files } = e.target;
    if (name === "media") {
      setFormData((prevData) => ({
        ...prevData,
        media: files[0],
      }));
    } else if (name.startsWith("author")) {
      const index = parseInt(name.split("-")[1], 10);
      const newAuthors = [...formData.authors];
      newAuthors[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        authors: newAuthors,
      }));
    } else if (name === "creator_visibility") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || "",  // Ajout de cette ligne pour s'assurer que les valeurs vides ne sont pas undefined
      }));
    }
  }

  function addAuthor() {
    setFormData((prevData) => ({
      ...prevData,
      authors: [...prevData.authors, ""],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("name", formData.name || "");  // Remplacer undefined par une chaîne vide
    newFormData.append("edition", formData.edition || "");
    newFormData.append("type", formData.type || "");
    newFormData.append("format", formData.format || "");
    newFormData.append("number", formData.number || null);  // Remplacer "" par null si non renseigné
    newFormData.append("title", formData.title || "");
    newFormData.append("isbn", formData.isbn || "");
    newFormData.append("summary", formData.summary || "");  // Assurez-vous que summary n'est pas undefined
    newFormData.append("creator_visibility", formData.creator_visibility ? "1" : "0");
    
    if (formData.media) {
      newFormData.append("media", formData.media);
    }
    
    formData.authors.forEach((author, index) => {
      newFormData.append(`author-${index}`, author || ""); // Remplacer undefined pour les auteurs
    });
    try {
      const response = await fetch(`${API_URL}/works/create`, {
        method: "POST",
        credentials: "include",
        body: newFormData,
      });

      if (response.ok) {
        const checkSession = await fetch(`${API_URL}/auth/session`, {
          method: "GET",
          credentials: "include",
        });
        if (checkSession.ok) {
          const resJSON = await checkSession.json();
          dispatch(login(resJSON.user));
          toast.success("Ouvrage créé!");
          navigate("/");
        } else {
          toast.error(
            "Échec de la vérification de la session. Veuillez réessayer."
          );
        }
      } else {
        const resJSON = await response.json();
        toast.error(
          resJSON.message || "Échec de la création. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création.", error);
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
            <label htmlFor="BD">BD</label>
            <input
              type="radio"
              id="Livre"
              name="type"
              value="Livre"
              checked={formData.type === "Livre"}
              onChange={handleChange}
            />
            <label htmlFor="Livre">Livre</label>
            <input
              type="radio"
              id="Manga"
              name="type"
              value="Manga"
              checked={formData.type === "Manga"}
              onChange={handleChange}
            />
            <label htmlFor="Manga">Manga</label>
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
            <label htmlFor="livre">livre</label>
            <input
              type="radio"
              id="poche"
              name="format"
              value="poche"
              checked={formData.format === "poche"}
              onChange={handleChange}
            />
            <label htmlFor="poche">poche</label>
            <input
              type="radio"
              id="ebook"
              name="format"
              value="ebook"
              checked={formData.format === "ebook"}
              onChange={handleChange}
            />
            <label htmlFor="ebook">ebook</label>
            <input
              type="radio"
              id="comics"
              name="format"
              value="comics"
              checked={formData.format === "comics"}
              onChange={handleChange}
            />
            <label htmlFor="comics">comics</label>
            <input
              type="radio"
              id="manga"
              name="format"
              value="manga"
              checked={formData.format === "manga"}
              onChange={handleChange}
            />
            <label htmlFor="manga">manga</label>
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
            value={formData.summary}
            onChange={handleChange}
          />
        </div>
        {formData.authors.map((author, index) => (
          <div key={index}>
            <label htmlFor={`author-${index}`}>Auteur {index + 1}</label>
            <input
              type="text"
              id={`author-${index}`}
              name={`author-${index}`}
              value={author}
              onChange={handleChange}
            />
          </div>
        ))}
        <button type="button" onClick={addAuthor}>
          Ajouter un auteur
        </button>
        <div>
          <label htmlFor="media">Image de couverture</label>
          <input
            type="file"
            id="media"
            name="media"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="creator_visibility"
            name="creator_visibility"
            checked={formData.creator_visibility}
            onChange={handleChange}
          />
          <label htmlFor="creator_visibility">
            Je souhaite rendre mon pseudo visible en tant que créateur de ce
            volume
          </label>
        </div>
        <button type="submit">Valider</button>
      </form>
    </>
  );
}

export default Creator;
