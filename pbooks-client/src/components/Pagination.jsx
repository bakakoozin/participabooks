import { useMemo } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import styles from "../assets/style/scss/Pagination.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

export function Pagination({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const page = parseInt(searchParams.get("page")) || 1;
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  return (
    <nav className={styles.paginationNav}>
      <ul className={styles.pagination}>
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page === 1}
            onClick={() => handlePageChange(1)}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
        </li>
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page <= 0}
            onClick={() => handlePageChange(page - 1)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            Précédent
          </button>
        </li>
        {pages.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`${styles.pageItem} ${
              page === pageNumber ? styles.active : ""
            }`}
          >
            <button
              className={styles.pageLink}
              disabled={page === pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Suivant
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </li>
        <li className={styles.pageItem}>
          <button
            className={styles.pageLink}
            disabled={page >= totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number,
};
