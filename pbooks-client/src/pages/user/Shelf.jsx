import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { scrollSlider } from "../../utils/slider";
import { useFetch } from "../../hooks/useFetch";
import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { Img } from "../../components/Img";
import styles from "../../assets/style/scss/Library.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "../../components/Pagination";
import { AuthorsList } from "../../components/AuthorsList";

function Shelf() {
  const { data, isFetching, search, setSearch } = useFetch("/user/shelf", {
    initData: [],
  });
  const [updatedData, setUpdatedData] = useState(data?.datas || []);
  const sliderRef = useRef(null);

  const handleRemoveWork = (removedWorkId) => {
    setUpdatedData((prevData) =>
      prevData.filter((work) => work.works_id !== removedWorkId)
    );
  };

  useEffect(() => {
    setUpdatedData(data?.datas || []);
  }, [data]);

  return (
    <main className={styles.mainContainer}>
      <h1>Ma bibliothèque</h1>
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
                  <Img src={work.cover_url} alt={work.works_name} />
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

export default Shelf;
