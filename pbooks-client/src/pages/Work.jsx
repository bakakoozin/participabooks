import { useParams } from "react-router-dom";

import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { Img } from "../components/Img";
import { useFetch } from "../hooks/useFetch";

function Work() {
  const { id } = useParams();
  const { data, isFetching } = useFetch(`/works/${id}`, {
    initData: { datas: [] },
  });

  if (isFetching) return <p>Chargement...</p>;

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

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

      {data.datas.map((volume) => (
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
