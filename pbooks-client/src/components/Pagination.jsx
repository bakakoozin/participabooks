import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useMemo } from "react";

import styles from "../assets/style/scss/Pagination.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

// Composant Pagination
export function Pagination({ totalPages }) {
  // Utilisation des paramètres de recherche pour gérer la pagination
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const page = parseInt(searchParams.get("page")) || 1; // Récupère la page actuelle depuis les paramètres de recherche
  
  // Génère un tableau contenant tous les numéros de pages
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // Gère le changement de page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Vérifie que la page est valide
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage); // Met à jour le paramètre "page"
    setSearchParams(params); // Met à jour l'URL avec la nouvelle page
  };

  // Si le nombre total de pages est inférieur ou égal à 1, ne pas afficher la pagination
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.paginationNav}>
      <ul className={styles.pagination}>
        {/* Bouton pour aller à la première page */}
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page === 1} // Désactive le bouton si on est déjà sur la première page
            onClick={() => handlePageChange(1)}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
        </li>

        {/* Bouton pour aller à la page précédente */}
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page <= 0} // Désactive le bouton si on est sur la première page
            onClick={() => handlePageChange(page - 1)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            Précédent
          </button>
        </li>

        {/* Sélecteur pour choisir une page spécifique */}
        <select
          className={styles.pageLink}
          name=""
          id=""
          value={page} // Définit la page actuelle comme valeur sélectionnée
          onChange={(e) => handlePageChange(parseInt(e.target.value))} // Change de page en fonction de la sélection
        >
          {pages.map((pageNumber) => (
            <option
              value={pageNumber}
              key={pageNumber}
              className={`${styles.pageItem} ${
                page === pageNumber ? styles.active : "" // Ajoute une classe active pour la page actuelle
              }`}
            >
              {pageNumber}
            </option>
          ))}
        </select>

        {/* Bouton pour aller à la page suivante */}
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page >= totalPages} // Désactive le bouton si on est sur la dernière page
            onClick={() => handlePageChange(page + 1)}
          >
            Suivant
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </li>

        {/* Bouton pour aller à la dernière page */}
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page >= totalPages} // Désactive le bouton si on est déjà sur la dernière page
            onClick={() => handlePageChange(totalPages)}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

// Définit les types des props attendues
Pagination.propTypes = {
  totalPages: PropTypes.number, // Nombre total de pages
};
