import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useFetch } from "../../hooks/useFetch";
import { useTitle } from "../../hooks/useTitle";
import { API_URL } from "../../utils/constants";

import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { ButtonReturn } from "../../components/UI/ButtonReturn";
import { ReadMore } from "../../components/ReadMore";
import { Img } from "../../components/Img";

import styles from "../../assets/style/scss/Work.module.scss";

export function ShelfWorkDetails() {
  const { id } = useParams();
  const { data } = useFetch(`/user/shelf/work/${id}`, {
    initData: { datas: [] },
  });

  const [volumes, setVolumes] = useState([]);

  // Fonction pour gérer le changement de statut
  const handleStatusToggle = async (volumeId, newStatus) => {
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

  // Fonction pour gérer la suppression d'un volume de la collection
  const handleRemove = (id) => {
    setVolumes((prevVolumes) =>
      prevVolumes.filter(
        (volume) => volume.vol_id !== id && volume.works_id !== id
      )
    );
  };

  useTitle(`${data.datas[0]?.works_name} détails`);
  useEffect(() => {
    if (data.datas.length > 0) {
      const mapped = data.datas.map((volume) => ({
        ...volume,
        status: volume.vol_status_user ?? null,
      }));
      setVolumes(mapped);
    }
  }, [data]);

  const workInfo = volumes.length > 0 ? volumes[0] : {};

  return (
    <main className={styles.mainContainer}>
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
      <div className={styles.btnContainer}></div>
      <section
        className={`${styles.cardContainer} ${
          volumes.length === 1 ? styles.singleCard : ""
        }`}
      >
        {volumes.map((volume) => (
          <section key={volume.vol_id} className={styles.volumeCard}>
            <header className={styles.volumeCardHeader}>
              <section className={styles.volumeCardHeaderInfos}>
                <h3>
                  {volume.vol_num}. {volume.vol_title}
                </h3>

                <div className={styles.statusRadios}>
                  <label
                    className={volume.status === "lu" ? styles.selected : ""}
                  >
                    <input
                      type="radio"
                      name={`status-${volume.vol_id}`}
                      value="lu"
                      checked={volume.status === "lu"}
                      onChange={() => handleStatusToggle(volume.vol_id, "lu")}
                    />
                    Lu
                  </label>

                  <label
                    className={
                      volume.status === "à lire" ? styles.selected : ""
                    }
                  >
                    <input
                      type="radio"
                      name={`status-${volume.vol_id}`}
                      value="à lire"
                      checked={volume.status === "à lire"}
                      onChange={() =>
                        handleStatusToggle(volume.vol_id, "à lire")
                      }
                    />
                    À lire
                  </label>
                </div>
              </section>
              <div className={styles.isbnContainer}>
                <p className={styles.isbn}>ISBN : </p>
                <p>{volume.vol_isbn}</p>
              </div>
            </header>
            <figure>
              <Img
                src={volume.url_media}
                alt={`image de couverture de ${volume.vol_title}`}
              />
            </figure>
            <footer className={styles.volumeCardFooter}>
              <article className={styles.summary}>
                <article className={styles.authors}>
                  {volume.authors_name &&
                    volume.authors_name
                      .split(",")
                      .map((author, index) => (
                        <p key={index}>{author.trim()}</p>
                      ))}
                </article>
                <h3>Résumé</h3>
                <ReadMore text={volume.vol_summary} maxLength={200} />
              </article>
              <div className={styles.btnContainer}>
                <ButtonRemoveFromShelf
                  item={volume}
                  type="volume"
                  onRemove={handleRemove}
                  ariaLabel={`Supprimer le volume ${volume.vol_title} de ma collection`}
                />
              </div>
            </footer>
          </section>
        ))}
      </section>
    </main>
  );
}
