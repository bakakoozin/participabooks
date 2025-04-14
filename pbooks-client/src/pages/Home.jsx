import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { scrollSlider } from "../utils/slider";
import { useFetch } from "../hooks/useFetch";
import { ButtonAddToShelf } from "../components/UI/ButtonAddToShelf";
import { ButtonRemove } from "../components/UI/ButtonRemove";
import { Img } from "../components/Img";
import { useSelector } from "react-redux";
import styles from "../assets/style/scss/Home.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "../components/Pagination";

export function Home() {
  const { infos } = useSelector((state) => state.auth);
  const { data, isFetching, search, setSearch } = useFetch("/works/", {
    initData: { datas: [], totalPages: 0 },
  });
  const [updatedData, setUpdatedData] = useState(data?.datas || []);
  const sliderRef = useRef(null);
  const handleRemoveWork = (removedWorkId) => {
    setUpdatedData((prevData) =>
      prevData.filter((work) => work.works_id !== removedWorkId)
    );
  };

  const canSeeWork = (work) => {
    const isLogged = !!infos;
    const isAdmin = infos?.isAdmin || infos?.role === "admin";
    const isMod = infos?.isModerator || infos?.role === "moderator";

    if (!work.volumes || work.volumes.length === 0) return false;

    // 1. Si un volume est validé → visible pour tous
    const hasValidVolume = work.volumes.some(
      (volume) => volume.vol_status === "validé"
    );
    if (hasValidVolume) return true;

    // 2. Sinon, check droits spéciaux
    if (!isLogged) return false;

    return work.volumes.some(
      (volume) => volume.user_id === infos.id || isAdmin || isMod
    );
  };

  useEffect(() => {
    setUpdatedData(data?.datas || []);
  }, [data]);

  return (
    <main className={styles.mainContainer}>
      <h1>Bibliothèque</h1>
      <form className={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <Pagination totalPages={data.totalPages} />

      <section className={styles.sliderContainer}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scrollSlider(sliderRef, "left")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <article className={styles.slider} ref={sliderRef}>
          {updatedData?.map((work) => {
            if (!canSeeWork(work)) return null;

            return (
              <section key={work.works_id} className={styles.workCard}>
                <header>
                  <h2>{work.works_name}</h2>
                  <div className={styles.workInfos}>
                    <p>{work.works_type}</p>
                    <p>Format {work.works_format}</p>
                  </div>
                </header>
                <figure>
                  <Link to={`/works/${work.works_id}`}>
                    <Img src={work.cover_url} alt={work.works_name} />
                  </Link>
                </figure>
                <footer className={styles.workFooter}>
                  <aside className={styles.authorsList}>
                    {work.authors_name &&
                      work.authors_name
                        .split(",")
                        .map((author, index) => (
                          <p key={index}>{author.trim()}</p>
                        ))}
                  </aside>
                  <aside className={styles.buttons}>
                    <p>Editions {work.works_edition}</p>
                    <ButtonAddToShelf item={work} type="work" />
                    {work.volumes[0].vol_status === "en attente" &&
                      (work.volumes[0].user_id === infos?.id ||
                        infos?.role === "admin" ||
                        infos?.role === "moderator") && (
                        <Link
                          to={`/works/${work.works_id}/edit`}
                          className={styles.btnEdit}
                        >
                          Editer
                        </Link>
                      )}
                    <ButtonRemove
                      item={work}
                      type="work"
                      onRemove={() => handleRemoveWork(work.works_id)}
                    />
                  </aside>
                </footer>
              </section>
            );
          })}
        </article>
        <div>
          {isFetching && <p>Chargement...</p>}
          {data?.datas?.length === 0 && !isFetching && (
            <p>Aucun ouvrage trouvé.</p>
          )}
        </div>
        <button
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => scrollSlider(sliderRef, "right")}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </section>
    </main>
  );
}
