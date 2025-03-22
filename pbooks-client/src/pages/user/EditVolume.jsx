import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../utils/constants";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

function EditVolume() {
  const { volumeId } = useParams();
  const refMedia = useRef(null);
  const [formData, setFormData] = useState({
    volumes_id: volumeId,
    number: "",
    title: "",
    isbn: "",
    summary: "",
    creator_visibility: 0,
    media: null,
    authors: [""],
  });

  // Utilisation du hook personnalisé pour fetch les données
  const { data, isFetching } = useFetch(`/works/volumes/${volumeId}`, {
    initData: { datas: {} }, // Valeur par défaut (vide)
  });

  // Affichage des erreurs ou des données dans la console
  useEffect(() => {
    if (data.datas) {
      // On vérifie si data.datas est défini
      const volumeInfo = data.datas;

      // Traitement de l'auteur : on s'assure que c'est un tableau, même s'il n'y a qu'un auteur
      const authors = volumeInfo.author_name ? [volumeInfo.author_name] : [""]; // Si author_name existe, on le met dans un tableau

      setFormData((prevData) => ({
        ...prevData,
        number: volumeInfo.number || "",
        title: volumeInfo.title || "",
        isbn: volumeInfo.isbn || "",
        summary: volumeInfo.summary || "",
        creator_visibility: volumeInfo.creator_visibility === "1",
        authors: authors, // Mettre à jour la liste des auteurs dans le state
      }));
    }
  }, [data]); // Se déclenche à chaque changement de `data` ou `volumeId`

  // Affichage si en cours de récupération des données
  if (isFetching) return <p>Chargement...</p>;

  // Gestion des changements de valeur dans le formulaire
  function handleChange(e) {
    const { name, value, checked, files } = e.target;

    if (name === "media") {
      setFormData((prevData) => ({
        ...prevData,
        media: files[0],
      }));
    }
    if (name.startsWith("author")) {
      const index = parseInt(name.split("-")[1], 10);
      const newAuthors = [...formData.authors];
      newAuthors[index] = value;
      setFormData((prevData) => ({
        ...prevData,
        authors: newAuthors,
      }));
    }
    if (name === "creator_visibility") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  // Ajouter un auteur
  function addAuthor() {
    setFormData((prevData) => ({
      ...prevData,
      authors: [...prevData.authors, ""],
    }));
  }

  // Soumission du formulaire
  async function handleSubmit(e) {
    e.preventDefault();

    const updateData = {};

    if (formData.number !== data.datas.number)
      updateData.number = formData.number;
    if (formData.title !== data.datas.title) updateData.title = formData.title;
    if (formData.isbn !== data.datas.isbn) updateData.isbn = formData.isbn;
    if (formData.summary !== data.datas.summary)
      updateData.summary = formData.summary;
    if (formData.creator_visibility !== (data.datas.creator_visibility === "1"))
      updateData.creator_visibility = formData.creator_visibility ? "1" : "0";

    if (
      JSON.stringify(formData.authors) !==
      JSON.stringify([data.datas.author_name])
    ) {
      updateData.authors = formData.authors;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info("Aucune modification détectée.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/works/volumes/${volumeId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const resJSON = await response.json();

      if (response.ok) {
        toast.success("Volume mis à jour !");
        if (formData.media) {
          const volumesId = resJSON.volumesId;
          await updateMedia(volumesId);
        }
      } else {
        toast.error(
          resJSON.message || "Échec de la mise à jour. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
      toast.error("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  }

  // Mise à jour du média
  async function updateMedia(volumesId) {
    const fileData = new FormData();
    fileData.append("media", refMedia.current.files[0]);
    fileData.append("volumesId", volumesId);
    try {
      const mediaResponse = await fetch(`${API_URL}/works/uploads`, {
        method: "PATCH",
        credentials: "include",
        body: fileData,
      });

      if (mediaResponse.ok) {
        toast.success("Image de couverture mise à jour !");
      } else {
        toast.error("Échec de la mise à jour de l'image de couverture.");
      }
    } catch (error) {
      console.error("Erreur lors de l'upload du média.", error);
      toast.error("Erreur lors de l'upload du média.");
    }
  }

  // Rendu du formulaire avec les données récupérées
  return (
    <>
      {formData.number && formData.title && (
        <h2>
          Editer le volume n°{formData.number} - {formData.title}
        </h2>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="number">Numéro du volume</label>
          <input
            type="number"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder={formData.number || "Numéro du volume"}
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
            placeholder={formData.title || "Titre du volume"}
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
            placeholder={formData.isbn || "ISBN du volume"}
          />
        </div>
        <div>
          <label htmlFor="summary">Résumé</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder={formData.summary || "Résumé du volume"}
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
              placeholder={author || `Auteur ${index + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={addAuthor}>
          Ajouter un auteur
        </button>
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

      {formData.volumes_id && (
        <div>
          <h3>Ajouter une image de couverture</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="media">Image de couverture</label>
              <input
                ref={refMedia}
                type="file"
                id="media"
                name="media"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditVolume;
