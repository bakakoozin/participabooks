import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { API_URL, URL_MEDIAS } from "../utils/constants";
import notFoundCover from "/not-found.png";

function Work() {
  const { id } = useParams();
  const [volumes, setVolumes] = useState([]);
  const [error, setError] = useState(null);
  const { isLogged, infos: user } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchWork() {
      try {
        const res = await fetch(`${API_URL}/works/${id}`);
        if (res.ok) {
          const { datas } = await res.json();
          setVolumes(datas);
        } else {
          throw new Error("La réponse n'est pas au format JSON attendu.");
        }
      } catch (error) {
        setError(error.message);
        console.error("Erreur lors de la récupération des données:", error);
      }
    }
    fetchWork();
  }, []);

  function handleCover(volume) {
    if (volume.url_media) {
      return `${URL_MEDIAS}medias/${volume.url_media}`;
    } else return notFoundCover;
  }

  async function handleAddVolumeToShelf(volume) {
    try {
      const response = await fetch (`${API_URL}/user/shelf/volume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ volumes_id: volume.volumes_id, users_id: user.id }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Ajouté à la bibliothèque personnelle");
      } else {
        console.error("Erreur lors de l'ajout à la bibliothèque personnelle");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque personnelle:", error);
    }
  }

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  // Extraire les informations de l'ouvrage
  const workInfo = volumes.length > 0 ? volumes[0] : {};

  return (
      <section>
        <h1>Bibliothèque Public</h1>

        {/* Afficher les informations de l'ouvrage une seule fois */}
        {workInfo && (
          <article className="work-card">
            <h2>{workInfo.works_name}</h2>
            <p>Type d&apos;ouvrage : {workInfo.works_type}</p>
            <p>Édition : {workInfo.works_edition}</p>
            <p>Format de l&apos;ouvrage : {workInfo.works_format}</p>
          </article>
        )}

        {/* Afficher les volumes associés */}
        {volumes.map((volume) => (
          <aside key={volume.vol_id} className="volume-card">
            <h3>
              {volume.vol_num}. {volume.vol_title}
            </h3>
            <p>{volume.vol_score}</p>
            <p>{volume.authors_name}</p>
            <img src={handleCover(volume)} alt={volume.vol_title} />
            <p>ISBN : {volume.vol_isbn}</p>
            <h3>Résumé</h3>
            <p>{volume.vol_summary}</p>
            {isLogged && (
                <button onClick={() => handleAddVolumeToShelf(volume)}>Ajouter à ma bibliothèque</button>
              )}
          </aside>
        ))}
      </section>
  );
}

export default Work;
