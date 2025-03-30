import { useRef } from "react";
import { Link } from "react-router-dom";

import { scrollSlider } from "../utils/slider";
import { useFetch } from "../hooks/useFetch";
import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { ButtonRemove } from "../components/ButtonRemove";
import { Img } from "../components/Img";
import { useSelector } from "react-redux";
import styles from "../assets/style/scss/Home.module.scss";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const { infos } = useSelector((state) => state.auth);
  const { data, isFetching, search, setSearch } = useFetch("/works/", {
    initData: { datas: [] },
  });
  const sliderRef = useRef(null);

  return (
    <main className={styles.mainContainer}>
      <h1>Bibliothèque Publique</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
                <Link to={`/works/${work.works_id}`}>
                  <Img src={work.cover_url} alt={work.works_name} />
                </Link>
              </figure>
              <footer className={styles.workFooter}>
                <aside>
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
                  <ButtonRemove item={work} type="work" />
                  {work.vol_status === "en attente" &&
                    (work.volumes[0].user_id === infos?.id ||
                      infos?.role === "admin" ||
                      infos?.role === "moderator") && (
                      <Link to={`/works/${work.works_id}/edit`} className="btn">
                        Modifier
                      </Link>
                    )}
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

export default Home;
