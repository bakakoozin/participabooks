import PropTypes from "prop-types";
import { useRef } from "react";

import { URL_MEDIAS } from "../utils/constants";

// Gestion d'affichage des images
const Img = ({ src, alt }) => {
  const ref = useRef(null);
  const handleErrors = () => {
    ref.current.src = "/not-found.png";
  };
  
  return (
    <img
      onError={handleErrors}
      ref={ref}
      src={`${URL_MEDIAS}medias/${src}`}
      alt={alt}
    />
  );
};
Img.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export { Img };
