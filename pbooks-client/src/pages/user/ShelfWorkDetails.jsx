import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { Img } from "../../components/Img";
import { useFetch } from "../../hooks/useFetch";
import { ReadMore } from "../../components/ReadMore";
import styles from "../../assets/style/scss/ShelfWorkDetails.module.scss";
import { API_URL } from "../../utils/constants";
import { ButtonReturn } from "../../components/UI/ButtonReturn";

function ShelfWorkDetails() {
  const { id } = useParams();
  const { data, isFetching } = useFetch(`/user/shelf/work/${id}`, {
    initData: { datas: [] },
  });

  const [volumes, setVolumes] = useState([]);

  const handleStatusToggle = async (volumeId, currentStatus) => {
    const newStatus = currentStatus === "lu" ? "à lire" : "lu";
    try {
      const response = await fetch(
        `${API_URL}/user/shelf/volume/${volumeId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setVolumes((prev) =>
          prev.map((volume) =>
            volume.vol_id === volumeId
              ? { ...volume, status: newStatus }
              : volume
          )
        );
      } else {
        console.error("Erreur de mise à jour du statut");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  useEffect(() => {
    if (data.datas.length > 0) {
      setVolumes(data.datas);
    }
  }, [data]);

  if (isFetching) return <p>Chargement...</p>;

  const workInfo = volumes.length > 0 ? volumes[0] : {};

  return (
    <main className={styles.mainContainer}>
      <h1>Ma bibliothèque</h1>

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
      {volumes.map((volume) => (
        <section key={volume.vol_id} className={styles.volumeCard}>
          <header className={styles.volumeCardHeader}>
            <h3>
              {volume.vol_num}. {volume.vol_title}
            </h3>
            <label className={styles.statusCheckbox}>
              <input
                type="checkbox"
                checked={volume.status === "lu"}
                onChange={() =>
                  handleStatusToggle(volume.vol_id, volume.status)
                }
                aria-label={`Marquer comme ${
                  volume.status === "lu" ? "à lire" : "lu"
                }`}
              />
              {volume.status === "lu" ? "Lu" : "À lire"}
            </label>
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
              <ButtonRemoveFromShelf item={volume} type="volume" />
            </div>
          </footer>
        </section>
      ))}
    </main>
  );
}

export default ShelfWorkDetails;
