import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";

import styles from "../../assets/style/scss/Form.module.scss";

export function CreateWork() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    edition: "",
    type: "",
    format: "",
  });

  // Fonction pour gérer les changements dans les champs du formulaire
  function handleChange(e) {
    const { name, value } = e.target;

    if (name) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
    }
  }

  // Fonction pour gérer la soumission du formulaire
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
        navigate(`/createVol/${resJSON.worksId}`);
      } else {
        toast.error(
          resJSON.message || "Échec de la création. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création.", error);
    }
  }

  useTitle("Création d'un ouvrage");

  return (
    <main className={styles.mainContainer}>
      <h2>Créer un nouvel ouvrage</h2>
      <section className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Titre de l'ouvrage */}
          <div className={styles.inputContainer}>
            <label htmlFor="name">Titre de l&apos;ouvrage</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          {/* Nom de l'éditeur */}
          <div className={styles.inputContainer}>
            <label htmlFor="edition">Editions</label>
            <input
              type="text"
              id="edition"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </div>
          {/* Choix du type d'ouvrage */}
          <fieldset>
            <legend>Type d&apos;ouvrage</legend>
            <div>
              <input
                className={styles.radio}
                type="radio"
                id="BD"
                name="type"
                value="BD"
                checked={formData.type === "BD"}
                onChange={handleChange}
              />
              <label htmlFor="BD">BD</label>
              <input
                className={styles.radio}
                type="radio"
                id="Livre"
                name="type"
                value="Livre"
                checked={formData.type === "Livre"}
                onChange={handleChange}
              />
              <label htmlFor="Livre">Livre</label>
              <input
                className={styles.radio}
                type="radio"
                id="Manga"
                name="type"
                value="Manga"
                checked={formData.type === "Manga"}
                onChange={handleChange}
              />
              <label htmlFor="Manga">Manga</label>
            </div>
          </fieldset>
          {/* Choix du format */}
          <fieldset>
            <legend>Format</legend>
            <div>
              <input
                className={styles.radio}
                type="radio"
                id="livre"
                name="format"
                value="livre"
                checked={formData.format === "livre"}
                onChange={handleChange}
              />
              <label htmlFor="livre">livre</label>
              <input
                className={styles.radio}
                type="radio"
                id="poche"
                name="format"
                value="poche"
                checked={formData.format === "poche"}
                onChange={handleChange}
              />
              <label htmlFor="poche">poche</label>
              <input
                className={styles.radio}
                type="radio"
                id="ebook"
                name="format"
                value="ebook"
                checked={formData.format === "ebook"}
                onChange={handleChange}
              />
              <label htmlFor="ebook">ebook</label>
              <input
                className={styles.radio}
                type="radio"
                id="comics"
                name="format"
                value="comics"
                checked={formData.format === "comics"}
                onChange={handleChange}
              />
              <label htmlFor="comics">comics</label>
              <input
                className={styles.radio}
                type="radio"
                id="manga"
                name="format"
                value="manga"
                checked={formData.format === "manga"}
                onChange={handleChange}
              />
              <label htmlFor="manga">manga</label>
            </div>
          </fieldset>
          {/* Validation du formulaire */}
          <div className={styles.validateContainer}>
            <button type="submit" className={styles.btn}>
              Valider
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
