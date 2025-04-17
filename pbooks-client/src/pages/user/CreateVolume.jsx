import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";
import { useFetch } from "../../hooks/useFetch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../assets/style/scss/Form.module.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function CreateVolume() {
  const { workId } = useParams();
  const [formData, setFormData] = useState({
    works_id: workId,
    number: "",
    title: "",
    isbn: "",
    summary: "",
    creator_visibility: 0,
    authors: [""],
  });

  const { data, isFetching } = useFetch(`/works/${workId}`, {
    initData: { datas: [] },
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, checked } = e.target;

    if (name.startsWith("author")) {
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

  function removeAuthor(index) {
    setFormData((prevData) => {
      const newAuthors = [...prevData.authors];
      newAuthors.splice(index, 1);
      return { ...prevData, authors: newAuthors };
    });
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
      const response = await fetch(`${API_URL}/works/volumes/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const resJSON = await response.json();

      if (response.ok) {
        toast.success("Volume créé !");
        navigate(`/works/${workId}`);
      } else {
        toast.error(
          resJSON.message || "Échec de la création. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création.", error);
      toast.error("Erreur lors de la création. Veuillez réessayer.");
    }
  }

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

  useTitle("Création d'un volume");
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

  return (
    <main className={styles.mainContainer}>
      {workInfo && (
        <h2>Ajouter un volume à l&apos;ouvrage {workInfo.works_name}</h2>
      )}
      <section className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor="number">Numéro du volume</label>
            <input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="title">Titre du volume</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputContainer}>
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
          <fieldset>
            <legend>Auteur(s)</legend>
            {formData.authors.map((author, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`author-${index}`}
                  name={`author-${index}`}
                  value={author}
                  onChange={handleChange}
                />
                {formData.authors.length > 1 && index > 0 && (
                  <button
                    type="button"
                    className={styles.btnClose}
                    onClick={() => removeAuthor(index)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
                {index === formData.authors.length - 1 && (
                  <button
                    type="button"
                    className={styles.btnAuthor}
                    onClick={addAuthor}
                  >
                    Ajouter un auteur
                  </button>
                )}
              </div>
            ))}
          </fieldset>
          <div>
            <input
              className={styles.checkbox}
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
          <div className={styles.validateContainer}>
            <button type="submit" className={styles.btn}>
              Ajouter volume
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.cancelBtn}`}
              onClick={() => navigate(-1)}
            >
              Annuler
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
