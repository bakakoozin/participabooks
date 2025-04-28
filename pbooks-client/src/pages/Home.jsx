import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useMetaDescription } from "../hooks/useMetaDescription";
import { scrollSlider } from "../utils/slider";
import { useFetch } from "../hooks/useFetch";
import { useTitle } from "../hooks/useTitle";

import { ButtonAddToShelf } from "../components/UI/ButtonAddToShelf";
import { ButtonRemove } from "../components/UI/ButtonRemove";
import { AuthorsList } from "../components/AuthorsList";
import { Pagination } from "../components/Pagination";
import { Img } from "../components/Img";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../assets/style/scss/Library.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
  console.log(search)

  // Fonction pour vérifier si l'utilisateur peut voir un ouvrage
  const canSeeWork = (work) => {
    const isLogged = !!infos;
    const isAdmin = infos?.isAdmin || infos?.role === "admin";
    const isMod = infos?.isModerator || infos?.role === "moderator";

    if (!work.volumes || work.volumes.length === 0) return false;

    const hasValidVolume = work.volumes.some(
      (volume) => volume.vol_status === "validé"
    );
    if (hasValidVolume) return true;

    if (!isLogged) return false;
    return work.volumes.some(
      (volume) => volume.user_id === infos.id || isAdmin || isMod
    );
  };

  useTitle("Bibliothèque");
  useMetaDescription("Bibliothèque publique de participabooks.");

  useEffect(() => {
    setUpdatedData(data?.datas || []);
  }, [data]);

  return (
    <main className={styles.mainContainer}>
      <h1>Bibliothèque</h1>
      <header className={styles.headerLibrary}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scrollSlider(sliderRef, "left")}
          aria-label="Faire défiler vers la gauche"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <form className={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button
          className={`${styles.navButton} ${styles.right}`}
          onClick={() => scrollSlider(sliderRef, "right")}
          aria-label="Faire défiler vers la droite"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </header>
      <Pagination totalPages={data.totalPages} />

      <section className={styles.sliderContainer}>
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
                    <Img 
                      src={work.cover_url} 
                      alt={`image de couverture de ${work.works_name}`} 
                    />
                  </Link>
                </figure>
                <footer className={styles.workFooter}>
                  <aside className={styles.authorsList}>
                    <AuthorsList workAuthors={work.authors_name} />
                  </aside>
                  <aside className={styles.buttons}>
                    <p>Editions {work.works_edition}</p>
                    <ButtonAddToShelf
                      item={work}
                      type="work"
                      ariaLabel={`Ajouter l'ouvrage ${work.works_name} à ma bibliothèque`}
                    />
                    {work.volumes[0].vol_status === "en attente" &&
                      (work.volumes[0].user_id === infos?.id ||
                        infos?.role === "admin" ||
                        infos?.role === "moderator") && (
                        <Link
                          to={`/works/${work.works_id}/edit`}
                          className={styles.btnEdit}
                          aria-label={`Éditer l’ouvrage ${work.works_name}`}
                        >
                          Editer
                        </Link>
                      )}
                    <ButtonRemove
                      item={work}
                      type="work"
                      onRemove={() => handleRemoveWork(work.works_id)}
                      ariaLabel={`Supprimer le volume ${work.works_name}`}
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
      </section>
    </main>
  );
}
