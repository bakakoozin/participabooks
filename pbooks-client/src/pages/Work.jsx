import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { API_URL } from "../utils/constants";
import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { Img } from "../components/Img";

function Work() {
  const { id } = useParams();
  const [volumes, setVolumes] = useState([]);
  const [error, setError] = useState(null);

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

  if (error) {
    return <p>Erreur: {error}</p>;
  }

  const workInfo = volumes.length > 0 ? volumes[0] : {};

  return (
      <section>
        <h1>Bibliothèque Public</h1>

        {workInfo && (
          <article className="work-card">
            <h2>{workInfo.works_name}</h2>
            <p>Type d&apos;ouvrage : {workInfo.works_type}</p>
            <p>Édition : {workInfo.works_edition}</p>
            <p>Format de l&apos;ouvrage : {workInfo.works_format}</p>
          </article>
        )}

        {volumes.map((volume) => (
          <aside key={volume.vol_id} className="volume-card">
            <h3>
              {volume.vol_num}. {volume.vol_title}
            </h3>
            <p>{volume.vol_score}</p>
            <p>{volume.authors_name}</p>
            <Img src={volume.url_media} alt={volume.vol_title} />
            <p>ISBN : {volume.vol_isbn}</p>
            <h3>Résumé</h3>
            <p>{volume.vol_summary}</p>
            <ButtonAddToShelf item={volume} type="volume" />
          </aside>
        ))}
      </section>
  );
}

export default Work;
