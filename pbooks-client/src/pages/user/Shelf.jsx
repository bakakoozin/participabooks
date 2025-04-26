import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useTitle } from "../../hooks/useTitle";
import { useFetch } from "../../hooks/useFetch";

import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { AuthorsList } from "../../components/AuthorsList";
import { Pagination } from "../../components/Pagination";
import { scrollSlider } from "../../utils/slider";
import { Img } from "../../components/Img";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../assets/style/scss/Library.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export function Shelf() {
  const { data, isFetching, search, setSearch } = useFetch("/user/shelf", {
    initData: { datas: [], totalPages: 0 },
  });
  const [updatedData, setUpdatedData] = useState(data?.datas || []);
  const sliderRef = useRef(null);

  // Fonction pour gérer la suppression d'un ouvrage dans le state local
  const handleRemoveWork = (removedWorkId) => {
    setUpdatedData((prevData) =>
      prevData.filter((work) => work.works_id !== removedWorkId)
    );
  };

  useTitle("Ma bibliothèque");
  useEffect(() => {
    setUpdatedData(data?.datas || []);
  }, [data]);

  return (
    <main className={styles.mainContainer}>
      <h1>Ma bibliothèque</h1>
      <header className={styles.headerLibrary}>
        <button
          className={`${styles.navButton} ${styles.left}`}
          onClick={() => scrollSlider(sliderRef, "left")}
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
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </header>
      <Pagination totalPages={data.totalPages} />

      <section className={styles.sliderContainer}>
        <article className={styles.slider} ref={sliderRef}>
          {updatedData?.map((work) => (
            <section key={work.works_id} className={styles.workCard}>
              <header>
                <h2>{work.works_name}</h2>
                <div className={styles.workInfos}>
                  <p>{work.works_type}</p>
                  <p>Format {work.works_format}</p>
                </div>
              </header>
              <figure>
                <Link to={`/shelf/work/${work.works_id}`}>
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
                  <p>{work.works_edition}</p>
                  <ButtonRemoveFromShelf
                    item={work}
                    type="work"
                    onRemove={() => handleRemoveWork(work.works_id)}
                    ariaLabel={`Supprimer l'ouvrage ${work.works_name} de ma bibliothèque`}
                  />
                </aside>
              </footer>
            </section>
          ))}
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
