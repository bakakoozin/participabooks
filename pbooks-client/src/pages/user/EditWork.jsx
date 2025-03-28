import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import { useSelector } from "react-redux";

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

  useEffect(() => {
    if (data?.datas.length) {
      setFormData(data.datas[0]);
    }
  }, [data]);

  if (isFetching) return <p>Chargement...</p>;

  if (!data.datas.length) {
    return <p>Ouvrage introuvable.</p>;
  }
  if (
    data?.datas?.[0].vol_status !== "en attente" ||
    data?.datas?.[0].user_id !== infos?.id
  )
    return <p>Vous ne pouvez pas modifier cet ouvrage.</p>;

  return (
    <>
      <h2>Editer l&apos;ouvrage</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Titre de l&apos;ouvrage</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.works_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="edition">Edition</label>
          <input
            type="text"
            id="edition"
            name="edition"
            value={formData.works_edition}
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
              checked={formData.works_type === "BD"}
              onChange={handleChange}
            />
            <label htmlFor="BD">BD</label>
            <input
              type="radio"
              id="Livre"
              name="type"
              value="Livre"
              checked={formData.works_type === "Livre"}
              onChange={handleChange}
            />
            <label htmlFor="Livre">Livre</label>
            <input
              type="radio"
              id="Manga"
              name="type"
              value="Manga"
              checked={formData.works_type === "Manga"}
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
              checked={formData.works_format === "livre"}
              onChange={handleChange}
            />
            <label htmlFor="livre">livre</label>
            <input
              type="radio"
              id="poche"
              name="format"
              value="poche"
              checked={formData.works_format === "poche"}
              onChange={handleChange}
            />
            <label htmlFor="poche">poche</label>
            <input
              type="radio"
              id="ebook"
              name="format"
              value="ebook"
              checked={formData.works_format === "ebook"}
              onChange={handleChange}
            />
            <label htmlFor="ebook">ebook</label>
            <input
              type="radio"
              id="comics"
              name="format"
              value="comics"
              checked={formData.works_format === "comics"}
              onChange={handleChange}
            />
            <label htmlFor="comics">comics</label>
            <input
              type="radio"
              id="manga"
              name="format"
              value="manga"
              checked={formData.works_format === "manga"}
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
