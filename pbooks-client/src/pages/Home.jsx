import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { API_URL, URL_MEDIAS } from "../utils/constants";
import scrollSlider from "../utils/slider";
import notFoundCover from "/not-found.png";

function Home() {
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const sliderRef = useRef(null);
  const { isLogged, infos: user } = useSelector((state) => state.auth);

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

  function handleCover(work) {
    return work.cover_url
      ? `${URL_MEDIAS}medias/${work.cover_url}`
      : notFoundCover;
  }

  async function handleAddWorkToShelf(work) {
    try {
      const response = await fetch (`${API_URL}/user/shelf/work`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ works_id: work.works_id, users_id: user.id }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Ajouté à la bibliothèque personnelle");
      } else {
        console.error("Erreur lors de l'ajout à la bibliothèque personnelle");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque personnelle:", error);
    }
  }

  const displayWorks = searchQuery ? searchResults : works;

  return (
    <section>
      <h1>Bibliothèque Publique</h1>
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
              <Link to={`/works/${work.works_id}`}>
                <img src={handleCover(work)} alt={work.works_name} />
              </Link>
              <p>{work.authors_name}</p>
              <p>{work.works_edition}</p>
              <p>{work.works_format}</p>
              {isLogged && (
                <button onClick={() => handleAddWorkToShelf(work)}>Ajouter à ma bibliothèque</button>
              )}
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

export default Home;
