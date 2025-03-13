import { useRef } from "react";
import { Link } from "react-router-dom";

import scrollSlider from "../utils/slider";
import { useFetch } from "../hooks/useFetch";
import { ButtonAddToShelf } from "../components/ButtonAddToShelf";
import { Img } from "../components/Img";

function Home() {
  const {data, search, setSearch} = useFetch("/works", { initData: [] });
  const sliderRef = useRef(null);
  const displayWorks = data?.datas || [];

  return (
    <section>
      <h1>Bibliothèque Publique</h1>

      <input
    
        className="search-bar"
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Déclenche la recherche au changement
      />

      <div className="slider-container">
        <button
          className="nav-button left"
          onClick={() => scrollSlider(sliderRef, "left")}
        >
          &lt;
        </button>

        <div className="slider" ref={sliderRef}>
        {displayWorks.length > 0 ? (
            displayWorks.map((work) => (
            <article key={work.works_id} className="work-card">
              <h2>{work.works_name}</h2>
              <p>{work.works_type}</p>
              <p>{work.works_score}</p>
              <Link to={`/works/${work.works_id}`}>
              <Img src={work.cover_url} alt={work.works_name} />  
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
              <ButtonAddToShelf work={work} />
            </article>
          ))) : (
            <p>Aucun résultat trouvé pour {search}</p>
          )}
        </div>

        <button
          className="nav-button right"
          onClick={() => scrollSlider(sliderRef, "right")}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export default Home;
