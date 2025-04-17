import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonCreateVolume = ({ item }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();
  const { isLogged, infos } = useSelector((state) => state.auth);

  const isCreatorOfVolumeInWork = item.volumes?.some(
    (vol) => vol.user_id && String(vol.user_id) === String(infos.id)
  );

  const canCreateVolume =
    isLogged &&
    (isCreatorOfVolumeInWork ||
      canEditVolume({ user_id: infos.id, vol_status: "en attente" }));

  if (!canCreateVolume) return null;

  const handleCreateVolume = () => {
    navigate(`/createVol/${item.works_id}`);
  };

  return (
    <button onClick={handleCreateVolume} className={styles.btnEdit}>
      Ajouter un volume
    </button>
  );
};

ButtonCreateVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonCreateVolume };
