import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { API_URL, URL_MEDIAS } from "../../utils/constants";
import scrollSlider from "../../utils/slider";
import notFoundCover from "/not-found.png";

function Shelf() {
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const res = await fetch(`${API_URL}/user/shelf`, {
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
      }
    }
    fetchWorks();
  }, []);

  async function handleSearch(value) {
    setSearchQuery(value);
    if (value === "") {
      setSearchResults(works);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/user/shelf/search?q=${encodeURIComponent(value)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        const { datas } = await res.json();
        setSearchResults(datas);
      } else {
        console.error("Erreur serveur:", res.status);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
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

  const displayWorks = searchQuery ? searchResults : works;

  return (
    <section>
      <h1>Ma bibliothèque</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)} // Déclenche la recherche au changement
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
        {displayWorks.length > 0 ? (
            displayWorks.map((work) => (
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
          ))) : (
            <p>Aucun résultat trouvé pour {searchQuery}</p>
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
