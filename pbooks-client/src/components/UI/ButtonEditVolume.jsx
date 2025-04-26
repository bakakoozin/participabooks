import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonEditVolume = ({ item, ariaLabel }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();

  // Vérifie si le volume est éditable
  const isEditable = item.vol_status === "en attente" && canEditVolume(item);
  if (!isEditable) return null;

  // Fonction pour gérer le clic sur le bouton d'édition
  const handleEditVolume = () => {
    navigate(`/editVol/${item.vol_id}`);
  };

  return (
    <button
      onClick={handleEditVolume}
      className={styles.btnEdit}
      aria-label={ariaLabel}
    >
      Éditer
    </button>
  );
};

ButtonEditVolume.propTypes = {
  item: PropTypes.object.isRequired,
  ariaLabel: PropTypes.string,
};

export { ButtonEditVolume };
