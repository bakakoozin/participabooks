import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { ButtonCreateVolume } from "../components/UI/ButtonCreateVolume";
import { ButtonAddToShelf } from "../components/UI/ButtonAddToShelf";
import { ButtonSelectStatus } from "../components/UI/ButtonSelectStatus";
import { Img } from "../components/Img";
import { useFetch } from "../hooks/useFetch";
import { ButtonEditVolume } from "../components/UI/ButtonEditVolume";
import { ButtonRemove } from "../components/UI/ButtonRemove";
import { ReadMore } from "../components/ReadMore";
import styles from "../assets/style/scss/Work.module.scss";
import { ButtonReturn } from "../components/UI/ButtonReturn";

function Work() {
  const { id } = useParams();
  const { data } = useFetch(`/works/${id}`, {
    initData: { datas: [] },
  });

  const [volumes, setVolumes] = useState([]);
  const workInfo = volumes.length > 0 ? volumes[0] : {};

  const handleStatusUpdate = (volId, newStatus) => {
    setVolumes((prevVolumes) =>
      prevVolumes.map((vol) =>
        vol.vol_id === volId ? { ...vol, vol_status: newStatus } : vol
      )
    );
  };

  const handleRemove = (id) => {
    setVolumes((prevVolumes) =>
      prevVolumes.filter((volume) => volume.vol_id !== id)
    );
  };

  useEffect(() => {
    if (data.datas.length > 0) {
      setVolumes(data.datas);
    }
  }, [data]);

  return (
    <main className={styles.mainContainer}>
      <h1>Bibliothèque</h1>

      {workInfo && (
        <section className={styles.workInfos}>
          <h2>{workInfo.works_name}</h2>
          <article className={styles.workArticle}>
            <aside>
              <p>
                {workInfo.works_type} au format {workInfo.works_format}
              </p>
              <p>Éditions {workInfo.works_edition}</p>
            </aside>
            <ButtonReturn />
          </article>
        </section>
      )}

      <div className={styles.btnContainer}>
        <ButtonCreateVolume item={workInfo} type="work" />
      </div>

      {volumes.map((volume) => (
        <section key={volume.vol_id} className={styles.volumeCard}>
          <header className={styles.volumeCardHeader}>
            <h3>
              {volume.vol_num}. {volume.vol_title}
            </h3>
            <article className={styles.authorsList}>
              {volume.authors_name &&
                volume.authors_name
                  .split(",")
                  .map((author, index) => <p key={index}>{author.trim()}</p>)}
            </article>
          </header>

          <figure>
            <Img src={volume.url_media} alt={volume.vol_title} />
          </figure>

          <footer className={styles.volumeCardFooter}>
            <p className={styles.isbn}>ISBN : {volume.vol_isbn}</p>

            <article className={styles.summary}>
              <h3>Résumé</h3>
              <ReadMore text={volume.vol_summary} maxLength={200} />
            </article>

            <div className={styles.btnContainer}>
              <ButtonAddToShelf item={volume} type="volume" />
              <ButtonEditVolume item={volume} type="volume" />
              <ButtonRemove
                item={volume}
                type="volume"
                onRemove={handleRemove}
              />
              <ButtonSelectStatus
                item={volume}
                onStatusUpdate={(newStatus) =>
                  handleStatusUpdate(volume.vol_id, newStatus)
                }
              />
            </div>
          </footer>
        </section>
      ))}
    </main>
  );
}

export default Work;
