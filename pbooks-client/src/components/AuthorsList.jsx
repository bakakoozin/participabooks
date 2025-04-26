import PropTypes from "prop-types";

// Limitation de l'affichage des auteurs à 3
export function AuthorsList({ workAuthors }) {
  if (!workAuthors) return null;

  const authors = workAuthors.split(",").map((a) => a.trim());
  const displayed = authors.slice(0, 3);

  return (
    <>
      {displayed.map((author, index) => (
        <p key={index}>{author}</p>
      ))}
      {authors.length > 3 && <p>...</p>}
    </>
  );
}

AuthorsList.propTypes = {
  workAuthors: PropTypes.string.isRequired,
};
