import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import scrollSlider from "../utils/slider";
import notFoundCover from "/not-found.png";

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [works, setWorks] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const res = await fetch(`${API_URL}/works`);
        if (res.ok) {
          const { datas } = await res.json();
          setWorks(datas);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }

    fetchWorks();
  }, [API_URL]);

  function handleCover(work) {
    return work.cover_url ? `/medias/${work.cover_url}` : notFoundCover;
  }

  return (
    <section>
      <h1>Bibliothèque Publique</h1>

      {/* Boutons de navigation */}
      <div className="slider-container">
        <button
          className="nav-button left"
          onClick={() => scrollSlider(sliderRef, "left")}
        >
          &lt;
        </button>

        <div className="slider" ref={sliderRef}>
          {works.map((work) => (
            <article key={work.works_id} className="work-card">
              <h2>{work.works_name}</h2>
              <p>{work.works_type}</p>
              <p>{work.works_score}</p>
              <Link to={`/works/${work.works_id}`}>
                <img src={handleCover(work)} alt={work.works_name} />
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
            </article>
          ))}
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
