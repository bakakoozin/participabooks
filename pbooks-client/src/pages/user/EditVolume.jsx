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

  const { data, isFetching } = useFetch(`/works/volumes/${volumeId}`, {
    initData: { datas: {} },
  });

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

  function addAuthor() {
    setFormData((prevData) => ({
      ...prevData,
      authors: [...prevData.authors, ""],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const updateData = { ...formData };

    if (formData.creator_visibility !== (data.datas.creator_visibility === "1"))
      updateData.creator_visibility = formData.creator_visibility ? "1" : "0";

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

      toast.success("Volume mis à jour !");
      if (formData.media) {
        const volumesId = resJSON.volumesId;
        await updateMedia(volumesId);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
      toast.error("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  }

  async function updateMedia(volumesId) {
    const fileData = new FormData();
    fileData.append("media", refMedia.current.files[0]);
    fileData.append("volumesId", volumesId);
    try {
      await fetch(`${API_URL}/works/uploads`, {
        method: "PATCH",
        credentials: "include",
        body: fileData,
      });
      toast.success("Image de couverture mise à jour !");
    } catch (error) {
      console.error("Erreur lors de l'upload du média.", error);
      toast.error("Erreur lors de l'upload du média.");
    }
  }

  useEffect(() => {
    if (data.datas) {
      const volumeInfo = data.datas;

      const authors = volumeInfo.author_name ? [volumeInfo.author_name] : [""];
      setFormData((prevData) => ({
        ...prevData,
        number: volumeInfo.number || "",
        title: volumeInfo.title || "",
        isbn: volumeInfo.isbn || "",
        summary: volumeInfo.summary || "",
        creator_visibility: volumeInfo.creator_visibility === "1",
        authors: authors,
      }));
    }
  }, [data]);

  if (isFetching) return <p>Chargement...</p>;

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
            placeholder={"Numéro du volume"}
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
            placeholder={"Titre du volume"}
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
            placeholder={"ISBN du volume"}
          />
        </div>
        <div>
          <label htmlFor="summary">Résumé</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder={"Résumé du volume"}
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
              placeholder={`Auteur ${index + 1}`}
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
