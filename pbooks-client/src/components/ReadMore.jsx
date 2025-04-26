import PropTypes from "prop-types";
import { useState } from "react";

import styles from "../assets/style/scss/Button.module.scss";

//
const ReadMore = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const handleToggle = () => setIsExpanded(!isExpanded);

  return (
    <p>
      {isExpanded
        ? text
        : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "")}
      {text.length > maxLength && (
        <span className={styles.btnContainer}>
          <button className={styles.btnReadMore} onClick={handleToggle}>
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        </span>
      )}
    </p>
  );
};

ReadMore.propTypes = {
  text: PropTypes.string,
  maxLength: PropTypes.number,
};

export { ReadMore };


// Condition → isExpanded

// Si isExpanded est true → on affiche text en entier.

// Sinon (false) → on affiche une version raccourcie de text.


// a. text.slice(0, maxLength)
// slice(0, maxLength) signifie :

// Prendre du caractère 0 (le début du texte)

// Jusqu'au caractère maxLength (non inclus).

// Donc, ça tronque le texte pour ne garder que les maxLength premiers caractères.

// b. + (...)
// Le + ici est utilisé pour concaténer (coller) deux morceaux de texte.

// c. (text.length > maxLength ? "..." : "")
// Encore un ternaire à l'intérieur !

// Si le texte original est plus long que maxLength, alors :

// Ajouter "..." pour indiquer qu'on a coupé du contenu.

// Sinon :

// Ajouter une chaîne vide "" (donc rien).