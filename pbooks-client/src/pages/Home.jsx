import { useRef } from "react";
import { Link } from "react-router-dom";

import { scrollSlider } from "../utils/slider";
import { useFetch } from "../hooks/useFetch";
import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { ButtonRemove } from "../components/ButtonRemove";
import { Img } from "../components/Img";
import { useSelector } from "react-redux";
import styles from "../assets/style/scss/Home.module.scss";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Home() {
  const { infos } = useSelector((state) => state.auth);
  const { data, isFetching, search, setSearch } = useFetch("/works/", {
    initData: { datas: [] },
  });
  const sliderRef = useRef(null);

  return (
    <section>
      <h1>Bibliothèque Publique</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="slider-container">
        <button
          className="nav-button left"
          onClick={() => scrollSlider(sliderRef, "left")}
        >
         <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <section className="slider" ref={sliderRef}>
          {data?.datas?.map((work) => (
            <article key={work.works_id} className="work-card">
              <header>
                <h2>{work.works_name}</h2>
                <div className={styles.workInfos}>
                  <p>{work.works_type}</p>
                  <p>{work.works_score}</p>
                </div>
              </header>
              <Link to={`/works/${work.works_id}`}>
                <Img src={work.cover_url} alt={work.works_name} />
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
              <footer className={styles.buttons}>
                <ButtonAddToShelf item={work} type="work" />
                <ButtonRemove item={work} type="work" />
                {(work.vol_status === "en attente" ||
                  work.volumes[0].user_id === infos?.id) && (
                  <Link to={`/works/${work.works_id}/edit`} className="btn">
                    Modifier
                  </Link>
                )}
              </footer>
            </article>
          ))}
        </section>
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
      </div>
    </section>
  );
}

export default Home;
