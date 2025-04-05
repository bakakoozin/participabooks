import { useState } from "react";
import PropTypes from "prop-types";

import styles from "../assets/style/scss/Button.module.scss";

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
