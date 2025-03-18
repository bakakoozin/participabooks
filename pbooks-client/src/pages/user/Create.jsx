import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

function CreateWork() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    edition: "",
    type: "",
    format: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const jsonData = {
      name: formData.name || "",
      edition: formData.edition || null,
      type: formData.type,
      format: formData.format || "",
    };

    try {
      const response = await fetch(`${API_URL}/works/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const resJSON = await response.json();
      console.log("Réponse API :", resJSON);

      if (response.ok) {
        toast.success("Ouvrage créé!");
        if (formData.media) {
          const fileData = new FormData();

          await fetch(`${API_URL}/works/create`, {
            method: "POST",
            credentials: "include",
            body: fileData,
          });
        }
        navigate(`/editor/${resJSON.worksId}`);
      } else {
        toast.error(
          resJSON.message || "Échec de la création. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création.", error);
    }
  }

  return (
    <>
      <h2>Créer ou mettre à jour un ouvrage</h2>

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
        <button type="submit">Valider</button>
      </form>
    </>
  );
}

export default CreateWork;