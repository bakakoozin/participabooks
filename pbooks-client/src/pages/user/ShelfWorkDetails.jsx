import { useParams } from "react-router-dom";

import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { Img } from "../../components/Img";
import { useFetch } from "../../hooks/useFetch";
import { ReadMore } from "../../components/ReadMore";
import styles from "../../assets/style/scss/ShelfWorkDetails.module.scss";

function ShelfWorkDetails() {
  const { id } = useParams();
  const { data, isFetching } = useFetch(`/user/shelf/work/${id}`, {
    initData: { datas: [] },
  });

  const updateVolumeStatus = async (volumeId, status) => {
    try {
      const response = await fetch(`/user/shelf/volume/${volumeId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  if (isFetching) return <p>Chargement...</p>;

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

  return (
    <main className={styles.mainContainer}>
      <h1>Ma bibliothèque</h1>

      {workInfo && (
        <section className={styles.workInfos}>
          <h2>{workInfo.works_name}</h2>
          <p>
            {workInfo.works_type} au format {workInfo.works_format}
          </p>
          <p>Éditions {workInfo.works_edition}</p>
        </section>
      )}
      {data.datas.map((volume) => (
        <section key={volume.vol_id} className={styles.volumeCard}>
          <header className={styles.volumeCardHeader}>
            <h3>
              {volume.vol_num}. {volume.vol_title}
            </h3>
            <article className={styles.authorsList}>
              {volume.authors_name &&
                volume.authors_name.split(",").map((author, index) => (
                  <p key={index}>
                    {author.trim()}
                  </p>
                ))}
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

            <div className={styles.checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  checked={volume.status === "lu"}
                  onChange={(e) =>
                    updateVolumeStatus(volume.vol_id, e.target.checked ? "lu" : "à lire")
                  }
                />
                Marquer comme {volume.status === "lu" ? "à lire" : "lu"}
              </label>
            </div>

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
