import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { API_URL } from "../../utils/constants";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

function EditWork() {
  const { id } = useParams();
  const refMedia = useRef(null);
  const [formData, setFormData] = useState({
    works_id: id,
    number: "",
    title: "",
    isbn: "",
    summary: "",
    creator_visibility: 0,
    media: null,
    authors: [""],
  });

  const { data, isFetching } = useFetch(`/works/${id}`, {
    initData: { datas: [] },
  });

  useEffect(() => {
    if (data.datas.length > 0) {
      const workInfo = data.datas[0];
      setFormData((prevData) => ({
        ...prevData,
        number: workInfo.number || "",
        title: workInfo.title || "",
        isbn: workInfo.isbn || "",
        summary: workInfo.summary || "",
        creator_visibility: workInfo.creator_visibility === "1",
        authors: workInfo.authors || [""],
      }));
    }
  }, [data]);

  if (isFetching) return <p>Chargement...</p>;

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

    const jsonData = {
      works_id: formData.works_id,
      number: formData.number || null,
      title: formData.title || null,
      isbn: formData.isbn,
      summary: formData.summary || null,
      creator_visibility: formData.creator_visibility ? "1" : "0",
      authors: JSON.stringify(formData.authors || []),
    };

    try {
      const response = await fetch(`${API_URL}/works/edit`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const resJSON = await response.json();

      if (response.ok) {
        toast.success("Ouvrage mis à jour !");
        if (formData.media) {
          const volumesId = resJSON.volumesId;
          console.log(volumesId);
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

  async function updateMedia(volumesId) {
    const fileData = new FormData();
    fileData.append("media", refMedia.current.files[0]);
    fileData.append("volumesId", volumesId);
    console.log(fileData);
    try {
      const mediaResponse = await fetch(`${API_URL}/works/uploads`, {
        method: "PATCH",
        credentials: "include",
        body: fileData,
      });

      if (mediaResponse.ok) {
        toast.success("Image de couverture mise à jour !");
      } else {
        toast.error(
          "Échec de la mise à jour de l'image de couverture. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'upload du média.", error);
      toast.error("Erreur lors de l'upload du média. Veuillez réessayer.");
    }
  }

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

  return (
    <>
      {workInfo && <h2>Editer l&apos;ouvrage {workInfo.works_name}</h2>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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

      {formData.works_id && (
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

export default EditWork;
