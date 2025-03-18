import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { API_URL } from "../../utils/constants";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

function EditWork() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    works_id: id,
    number: "",
    title: "",
    isbn: "",
    summary: "",
    creator_visibility: false,
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

    // if (name === "test") {
    //   //TODO: gérer
    // }

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
        toast.success("Ouvrage créé!");
        if (formData.media) {
          const fileData = new FormData();
          fileData.append("media", formData.media);
          fileData.append("volumesId", resJSON.volumesId);

          await fetch(`${API_URL}/works/create`, {
            method: "POST",
            credentials: "include",
            body: fileData,
          });
        }
        navigate("/");
      } else {
        toast.error(
          resJSON.message || "Échec de la création. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création.", error);
    }
  }

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

  return (
    <>
      {workInfo && <h2>Editer l&apos;ouvrage {workInfo.works_name}</h2>}

      <form onSubmit={handleSubmit}>
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

export default EditWork;