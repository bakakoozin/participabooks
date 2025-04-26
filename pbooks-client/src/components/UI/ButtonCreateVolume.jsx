import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonCreateVolume = ({ item, ariaLabel }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();
  const { isLogged, infos } = useSelector((state) => state.auth);

  // Vérification si l'utilisateur est connecté et s'il est le créateur d'un volume en cours
  const isCreatorOfVolumeInWork = item.volumes?.some(
    (vol) => vol.user_id && String(vol.user_id) === String(infos.id)
  );

  const canCreateVolume =
    isLogged &&
    (isCreatorOfVolumeInWork ||
      canEditVolume({ user_id: infos.id, vol_status: "en attente" }));

  if (!canCreateVolume) return null;

  // Fonction de gestion du clic sur le bouton
  const handleCreateVolume = () => {
    navigate(`/createVol/${item.works_id}`);
  };

  return (
    <button
      onClick={handleCreateVolume}
      className={styles.btnEdit}
      aria-label={ariaLabel}
    >
      Ajouter un volume
    </button>
  );
};

ButtonCreateVolume.propTypes = {
  item: PropTypes.object.isRequired,
  ariaLabel: PropTypes.string,
};

export { ButtonCreateVolume };
