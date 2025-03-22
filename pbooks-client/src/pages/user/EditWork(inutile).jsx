import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

function EditWork() {
  const { workId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    edition: "",
    type: "",
    format: "",
  });

  const { data, isFetching } = useFetch(`/works/${workId}`, {
    initData: { datas: {} },
  });

  useEffect(() => {
    if (data.datas) {
      const workInfo = data.datas;

      setFormData((prevData) => ({
        ...prevData,
        name: workInfo.name || "",
        edition: workInfo.edition || "",
        type: workInfo.type || "",
        format: workInfo.format || "",
      }));
    }
  }, [data]);

  if (isFetching) return <p>Chargement...</p>;

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

    const updateData = {};

    if (formData.name !== data.datas.name) updateData.name = formData.name;
    if (formData.edition !== data.datas.edition)
      updateData.edition = formData.edition;
    if (formData.type !== data.datas.type) updateData.type = formData.type;
    if (formData.format !== data.datas.format)
      updateData.format = formData.format;

    if (Object.keyq(updateData).length === 0) {
      toast.info("Aucune modification détectée.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/works/${workId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const resJSON = await response.json();

      if (response.ok) {
        toast.success("Ouvrage mis à jour!");
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

  return (
    <>
    {formData.name && (
      <h2>Editer l&apos;ouvrage {formData.name}</h2>
    )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Titre de l&apos;ouvrage</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={formData.name || "Titre de l'ouvrage"}
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
            placeholder={formData.edition || "Edition"}
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

export default EditWork;
