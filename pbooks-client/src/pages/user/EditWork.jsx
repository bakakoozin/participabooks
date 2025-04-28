import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";

import styles from "../../assets/style/scss/Form.module.scss";

export function EditWork() {
  const navigate = useNavigate();
  const { id } = useParams();
  const initData = {
    works_name: "",
    works_edition: "",
    works_type: "",
    works_format: "",
  };
  const { data, isFetching } = useFetch(`/works/${id}`, {
    initData: { datas: initData },
  });

  const [formData, setFormData] = useState(initData);
  const { infos } = useSelector((state) => state.auth);

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
      name: formData.works_name || "",
      edition: formData.works_edition || null,
      type: formData.works_type || "",
      format: formData.works_format || "",
    };

    try {
      const response = await fetch(`${API_URL}/works/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      const resJSON = await response.json();

      if (response.ok) {
        toast.success("Ouvrage mis à jour!");
        navigate(-1);
      } else {
        toast.error(
          resJSON.message || "Échec de la mise à jour. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour.", error);
    }
  }

  useTitle(`Editer l'ouvrage ${formData.works_name}`);

  // Mise à jour des données et préremplissage du formulaire
  useEffect(() => {
    if (data?.datas.length) {
      setFormData(data.datas[0]);
    }
  }, [data]);

  if (isFetching) return <p className={styles.loading}>Chargement...</p>;

  if (!data.datas.length) {
    return <p className={styles.message}>Ouvrage introuvable.</p>;
  }
  if (
    data?.datas?.[0].vol_status !== "en attente" ||
    (data?.datas?.[0].user_id !== infos?.id && infos.role !== "admin" && infos.role !== "moderator")
  )
    return (
      <p className={styles.message}>Vous ne pouvez pas modifier cet ouvrage.</p>
    );

  return (
    <main className={styles.mainContainer}>
      <h2>Editer l&apos;ouvrage</h2>
      <section className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Titre de l'ouvrage */}
          <div className={styles.inputContainer}>
            <label htmlFor="name">Titre de l&apos;ouvrage</label>
            <input
              type="text"
              id="name"
              name="works_name"
              value={formData.works_name}
              onChange={handleChange}
              placeholder={"Nom de l'ouvrage"}
            />
          </div>
          {/* Nom de l'éditeur */}
          <div className={styles.inputContainer}>
            <label htmlFor="edition">Editions</label>
            <input
              type="text"
              id="edition"
              name="works_edition"
              value={formData.works_edition}
              onChange={handleChange}
              placeholder={"Editions"}
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
                name="works_type"
                value="BD"
                checked={formData.works_type === "BD"}
                onChange={handleChange}
              />
              <label htmlFor="BD">BD</label>
              <input
                className={styles.radio}
                type="radio"
                id="Livre"
                name="works_type"
                value="Livre"
                checked={formData.works_type === "Livre"}
                onChange={handleChange}
              />
              <label htmlFor="Livre">Livre</label>
              <input
                className={styles.radio}
                type="radio"
                id="Manga"
                name="works_type"
                value="Manga"
                checked={formData.works_type === "Manga"}
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
                name="works_format"
                value="livre"
                checked={formData.works_format === "livre"}
                onChange={handleChange}
              />
              <label htmlFor="livre">livre</label>
              <input
                className={styles.radio}
                type="radio"
                id="poche"
                name="works_format"
                value="poche"
                checked={formData.works_format === "poche"}
                onChange={handleChange}
              />
              <label htmlFor="poche">poche</label>
              <input
                className={styles.radio}
                type="radio"
                id="ebook"
                name="works_format"
                value="ebook"
                checked={formData.works_format === "ebook"}
                onChange={handleChange}
              />
              <label htmlFor="ebook">ebook</label>
              <input
                className={styles.radio}
                type="radio"
                id="comics"
                name="works_format"
                value="comics"
                checked={formData.works_format === "comics"}
                onChange={handleChange}
              />
              <label htmlFor="comics">comics</label>
              <input
                className={styles.radio}
                type="radio"
                id="manga"
                name="works_format"
                value="manga"
                checked={formData.works_format === "manga"}
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
