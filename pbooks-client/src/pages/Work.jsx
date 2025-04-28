import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useMetaDescription } from "../hooks/useMetaDescription";
import { useFetch } from "../hooks/useFetch";
import { useTitle } from "../hooks/useTitle";

import { ButtonSelectStatus } from "../components/UI/ButtonSelectStatus";
import { ButtonCreateVolume } from "../components/UI/ButtonCreateVolume";
import { ButtonAddToShelf } from "../components/UI/ButtonAddToShelf";
import { ButtonEditVolume } from "../components/UI/ButtonEditVolume";
import { ButtonRemove } from "../components/UI/ButtonRemove";
import { ButtonReturn } from "../components/UI/ButtonReturn";
import { ReadMore } from "../components/ReadMore";
import { Img } from "../components/Img";

import styles from "../assets/style/scss/Work.module.scss";

export function Work() {
  const { id } = useParams();
  const { data } = useFetch(`/works/${id}`, {
    initData: { datas: [] },
  });

  const [volumes, setVolumes] = useState([]);
  const { infos } = useSelector((state) => state.auth);
  const workInfo = volumes.length > 0 ? volumes[0] : {};

  // Fonction pour mettre à jour le statut d'un volume
  const handleStatusUpdate = (volId, newStatus) => {
    setVolumes((prevVolumes) =>
      prevVolumes.map((vol) =>
        vol.vol_id === volId ? { ...vol, vol_status: newStatus } : vol
      )
    );
  };

  // Fonction pour supprimer un volume de la liste
  const handleRemove = (id) => {
    setVolumes((prevVolumes) =>
      prevVolumes.filter((volume) => volume.vol_id !== id)
    );
  };

  // Fonction pour vérifier si l'utilisateur peut voir un volume
  const canSeeVolume = (volume) => {
    if (volume.vol_status === "validé") {
      return true;
    }
    return volume.user_id === infos.id || infos.role.match(/admin|moderator/);
  };

  useTitle(`${workInfo.works_name} détails`);
  useMetaDescription(`${workInfo.works_name} - Détails et différents volumes.`);

  useEffect(() => {
    if (data.datas.length > 0) {
      setVolumes(data.datas);
    }
  }, [data]);

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
      <div className={styles.btnContainer}>
        <ButtonCreateVolume
          item={workInfo}
          type="work"
          ariaLabel={`Ajouter un volume à l'ouvrage ${workInfo.works_name}`}
        />
      </div>
      <section
        className={`${styles.cardContainer} ${
          volumes.length === 1 ? styles.singleCard : ""
        }`}
      >
        {volumes.map((volume) => {
          if (!canSeeVolume(volume)) {
            return null;
          }
          return (
            <section key={volume.vol_id} className={styles.volumeCard}>
              <header className={styles.volumeCardHeader}>
                <h3>
                  {volume.vol_num}. {volume.vol_title}
                </h3>
                <div className={styles.isbnContainer}>
                  <p className={styles.isbn}>ISBN : </p>
                  <p>{volume.vol_isbn}</p>
                </div>
              </header>
              <figure>
                <Img
                  src={volume.url_media}
                  alt={`Couverture de ${volume.vol_title}`}
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
                  <ButtonAddToShelf
                    item={volume}
                    type="volume"
                    ariaLabel={`Ajouter le volume ${volume.vol_title} à ma collection`}
                  />
                  <ButtonEditVolume
                    item={volume}
                    type="volume"
                    ariaLabel={`Editer le volume ${volume.vol_title}`}
                  />
                  <ButtonRemove
                    item={volume}
                    type="volume"
                    onRemove={handleRemove}
                    ariaLabel={`Supprimer le volume ${volume.vol_title}`}
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
          );
        })}
      </section>
    </main>
  );
}
