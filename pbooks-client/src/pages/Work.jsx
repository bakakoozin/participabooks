import { useParams } from "react-router-dom";

import { ButtonCreateVolume } from "../components/ButtonCreateVolume";
import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { Img } from "../components/Img";
import { useFetch } from "../hooks/useFetch";
import { ButtonEditVolume } from "../components/ButtonEditVolume";
import { ButtonRemove } from "../components/ButtonRemove";
import { ReadMore } from "../components/ReadMore";
import styles from "../assets/style/scss/Work.module.scss";

function Work() {
  const { id } = useParams();
  const { data } = useFetch(`/works/${id}`, {
    initData: { datas: [] },
  });

  const workInfo = data.datas.length > 0 ? data.datas[0] : {};

  return (
    <main className={styles.mainContainer}>
      <h1>Bibliothèque</h1>

      {workInfo && (
        <section className={styles.workInfos}>
          <h2>{workInfo.works_name}</h2>
          <p>
            {workInfo.works_type} au format {workInfo.works_format}
          </p>
          <p>Éditions {workInfo.works_edition}</p>
        </section>
      )}
      <div className={styles.btnContainer}>
        <ButtonCreateVolume item={workInfo} type="work" />
      </div>
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
          <p>ISBN : {volume.vol_isbn}</p>
          <article className={styles.summary}>
          <h3>Résumé</h3>
          <ReadMore text={volume.vol_summary} maxLength={200}/>
          </article>
          <div className={styles.btnContainer}>
            <ButtonAddToShelf item={volume} type="volume" />
            <ButtonEditVolume item={volume} type="volume" />
            <ButtonRemove item={volume} type="volume" />
          </div>
          </footer>
        </section>
      ))}
    </main>
  );
}

export default Work;
