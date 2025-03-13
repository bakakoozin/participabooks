import { useEffect, useState, useRef } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { Link } from "react-router-dom";

import { API_URL, URL_MEDIAS } from "../../utils/constants";
import scrollSlider from "../../utils/slider";
import notFoundCover from "/not-found.png";

function Shelf() {
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchDebounced = useDebounce(searchQuery, 500);
  const [isFetching, setIsFetching] = useState(false);
  const sliderRef = useRef(null);

  async function fetchWorks() {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await fetch(`${API_URL}/user/shelf?q=${searchQuery}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.status === 401) {
        console.error("Non autorisé. Vérifiez votre authentification !");
        return;
      }
      if (res.ok) {
        const { datas } = await res.json();
        setWorks(datas);
      } else {
        console.error("Erreur serveur:", res.status);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleRemoveFromShelf(work) {
    try {
      const response = await fetch(
        `${API_URL}/user/shelf/work/${work.works_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Supprimé de la bibliothèque personnelle");
      } else {
        console.error(
          "Erreur lors de la suppression de la bibliothèque personnelle"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la bibliothèque personnelle:",
        error
      );
    }
  }

  function handleCover(work) {
    return work.cover_url
      ? `${URL_MEDIAS}medias/${work.cover_url}`
      : notFoundCover;
  }

  useEffect(() => {
    fetchWorks();
  }, [searchDebounced]);

  return (
    <section>
      <h1>Ma bibliothèque</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Déclenche la recherche au changement
      />

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
              <Link to={`/shelf/work/${work.works_id}`}>
                <img src={handleCover(work)} alt={work.works_name} />
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
              <button onClick={() => handleRemoveFromShelf(work)}>
                Supprimer
              </button>
            </article>
          ))}
        </div>
        <div>
          {isFetching && <p>Chargement...</p>}
          {works.length === 0 && !isFetching && <p>Aucun ouvrage trouvé.</p>}
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
