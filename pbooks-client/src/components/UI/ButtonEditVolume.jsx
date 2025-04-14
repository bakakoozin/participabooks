import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "../../assets/style/scss/Button.module.scss";
import { useCanEditVolume } from "../../hooks/useCanEditVolume";


const ButtonEditVolume = ({ item }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();

  const isEditable = item.vol_status === "en attente" && canEditVolume(item);
  if (!isEditable) return null;

  const handleEditVolume = () => {
    navigate(`/editVol/${item.vol_id}`);
  };

  return <button onClick={handleEditVolume} className={styles.btnEdit}>Éditer</button>;
};

ButtonEditVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonEditVolume };
