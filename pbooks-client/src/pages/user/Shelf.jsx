import { useRef } from "react";
import { Link } from "react-router-dom";

import { scrollSlider } from "../../utils/slider";
import { useFetch } from "../../hooks/useFetch";
import { ButtonRemoveFromShelf } from "../../components/UI/ButtonRemoveFromShelf";
import { Img } from "../../components/Img";
import styles from "../../assets/style/scss/Shelf.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "../../components/Pagination";


function Shelf() {
  const { data, isFetching, search, setSearch } = useFetch("/user/shelf", {
    initData: [],
  });
  const sliderRef = useRef(null);

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

      <Pagination totalPages={data.totalPages}/>

      <section className="slider-container">
        <button
          className="nav-button left"
          onClick={() => scrollSlider(sliderRef, "left")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <article className="slider" ref={sliderRef}>
          {data?.datas?.map((work) => (
            <section key={work.works_id} className="work-card">
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
                  {work.authors_name &&
                    work.authors_name
                      .split(",")
                      .map((author, index) => (
                        <p key={index}>{author.trim()}</p>
                      ))}
                </aside>
                <aside className={styles.buttons}>
                  <p>{work.works_edition}</p>
                  <ButtonRemoveFromShelf item={work} type="work" />
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
          className="nav-button right"
          onClick={() => scrollSlider(sliderRef, "right")}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

      </section>
    </main>
  );
}

export default Shelf;
