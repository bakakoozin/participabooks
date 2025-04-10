import { useMemo } from "react";
import PropTypes from "prop-types";

import { useSearchParams } from "react-router";

export function Pagination({ totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const page = parseInt(searchParams.get("page")) || 1;
  const pages = useMemo(() => {
    const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    return pagesArray;
  }, [totalPages]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item disabled">
          <button
            className="page-link"
            disabled={page === 1}
            onClick={() => handlePageChange(0)}
          >
            Premier
          </button>
          <button
            className="page-link"
            disabled={page - 1 <= 0}
            onClick={() => handlePageChange(page - 1)}
          >
            Précédent
          </button>
        </li>
        {pages.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`page-item ${page === pageNumber ? "active" : ""}`}
          >
            <button
              className="page-link"
              disabled={page === pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="page-link"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Suivant
          </button>
          <button
            className="page-link"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            Dernier
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number,
};
