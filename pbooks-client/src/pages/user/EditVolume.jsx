import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { API_URL } from "../../utils/constants";
import styles from "../../assets/style/scss/Form.module.scss";

export function EditVolume() {
  const { volumeId } = useParams();
  const refMedia = useRef(null);
  const { infos } = useSelector((state) => state.auth);
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

  const [isFetching, setIsFetching] = useState(true);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, checked, files } = e.target;

    if (name === "media") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        media: file,
      }));
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
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

  function removeAuthor(index) {
    setFormData((prevData) => {
      const newAuthors = [...prevData.authors];
      newAuthors.splice(index, 1);
      return { ...prevData, authors: newAuthors };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const updateData = { ...formData };

    if (formData.creator_visibility !== (formData.creator_visibility === "1")) {
      updateData.creator_visibility = formData.creator_visibility ? "1" : "0";
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

      toast.success("Volume mis à jour !");
      if (formData.media) {
        const volumesId = resJSON.volumesId;
        await updateMedia(volumesId);
      }
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
      toast.error("Erreur lors de la mise à jour. Veuillez réessayer.");
    }
  }

  async function updateMedia() {
    const fileData = new FormData();
    fileData.append("media", refMedia.current.files[0]);
    fileData.append("volumesId", volumeId);
    try {
      await fetch(`${API_URL}/works/uploads/${volumeId}`, {
        method: "PATCH",
        credentials: "include",
        body: fileData,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload du média.", error);
      toast.error("Erreur lors de l'upload du média.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/works/volumes/${volumeId}`, {
          method: "GET",
          credentials: "include",
        });
        const resJSON = await response.json();

        if (resJSON.datas) {
          const volumeInfo = resJSON.datas;

          if (volumeInfo.length === 0) {
            setError("Ouvrage introuvable.");
            setIsFetching(false);
            return;
          }

          if (
            volumeInfo[1]?.vol_status === "en attente" &&
            volumeInfo[1]?.user_id === infos?.id
          ) {
            setError("Vous ne pouvez pas modifier cet ouvrage.");
            setIsFetching(false);
            return;
          }

          const authors_name = volumeInfo.authors_name;
          setFormData((prevData) => ({
            ...prevData,
            number: volumeInfo.number || "",
            title: volumeInfo.title || "",
            isbn: volumeInfo.isbn || "",
            summary: volumeInfo.summary || "",
            creator_visibility: volumeInfo.creator_visibility === "1",
            authors: authors_name,
          }));
        }
        setIsFetching(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données.", error);
        toast.error("Erreur lors de la récupération des données.");
        setIsFetching(false);
      }
    };

    fetchData();
  }, [volumeId, infos?.id]);

  if (isFetching) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className={styles.mainContainer}>
      {formData.number && formData.title && (
        <h2>
          Editer le volume n°{formData.number} - {formData.title}
        </h2>
      )}
      <section className={styles.formCard}>
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
                  placeholder={`Auteur ${index + 1}`}
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
              Valider modifications
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
        <hr className={styles.separator} />
        <p>Image de couverture</p>
        {formData.volumes_id && (
          <div className={styles.uploadContainer}>
            <label htmlFor="media" className={styles.btn}>
              Choisir un fichier
            </label>
            <input
              ref={refMedia}
              type="file"
              id="media"
              name="media"
              accept="image/*"
              onChange={handleChange}
              className={styles.hiddenInput}
            />
            {preview && (
              <div className={styles.mediaPreview}>
                <img
                  src={preview}
                  alt="Aperçu du media"
                  className={styles.preview}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
