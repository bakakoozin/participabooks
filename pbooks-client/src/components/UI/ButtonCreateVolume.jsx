import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";
import styles from "../../assets/style/scss/Button.module.scss";

const ButtonCreateVolume = ({ item }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();
  const { isLogged, infos } = useSelector((state) => state.auth);

  // Vérifier si l'utilisateur est connecté et s'il est le créateur de l'un des volumes de ce work
  const isCreatorOfVolumeInWork = item.volumes?.some((vol) => vol.user_id === infos.id);
  console.log(item)

  // Vérifier si l'utilisateur est connecté, s'il est soit le créateur d'un volume du work, soit un admin/modérateur
  const canCreateVolume =
    isLogged &&
    (isCreatorOfVolumeInWork || canEditVolume(item));

  // Si l'utilisateur n'est pas connecté ou ne remplit pas les conditions, on ne montre pas le bouton
  if (!canCreateVolume) {
    return null;
  }

  const handleCreateVolume = () => {
    navigate(`/createVol/${item.works_id}`);
  };

  return (
    <button onClick={handleCreateVolume} className={styles.btnAlert}>
      Ajouter un volume
    </button>
  );
};

ButtonCreateVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonCreateVolume };
