import { useRef } from "react";
import { Link } from "react-router-dom";

import scrollSlider from "../../utils/slider";
import { useFetch } from "../../hooks/useFetch";
import { ButtonRemoveFromShelf } from "../../components/ButtonRemoveFromShelf";
import { Img } from "../../components/Img";


function Shelf() {
  const { data, isFetching, search, setSearch } = useFetch("/user/shelf", {
    initData: [],
  });
  const sliderRef = useRef(null);

  return (
    <section>
      <h1>Ma bibliothèque</h1>

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
          &lt;
        </button>

        <div className="slider" ref={sliderRef}>
          {data?.datas?.map((work) => (
            <article key={work.works_id} className="work-card">
              <h2>{work.works_name}</h2>
              <p>{work.works_type}</p>
              <p>{work.works_score}</p>
              <Link to={`/shelf/work/${work.works_id}`}>
                <Img src={work.cover_url} alt={work.works_name} />
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
              <ButtonRemoveFromShelf item={work} type="work" />
            </article>
          ))}
        </div>
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
          &gt;
        </button>
      </div>
    </section>
  );
}

export default Shelf;
