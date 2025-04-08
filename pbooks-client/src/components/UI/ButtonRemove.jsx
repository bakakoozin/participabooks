import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { API_URL } from "../../utils/constants";
import styles from "../../assets/style/scss/Button.module.scss";
import { useCanEditVolume } from "../../hooks/useCanEditVolume";

const ButtonRemove = ({ item, type }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);
  const { canEditVolume } = useCanEditVolume();

  if (!isLogged) return null;

  const isWork = type === "work";

  if (isWork) {
    const allVolumesEnAttente =
      item.volumes && item.volumes.every((vol) => vol.vol_status === "en attente");

    if (!allVolumesEnAttente) return null;
  } else {
    if (item.vol_status !== "en attente") return null;

    const isCreator = infos?.id === item.user_id;
    const isPrivileged = canEditVolume(item);

    if (!isCreator && !isPrivileged) return null;
  }

  const handleRemove = async () => {
    const url = `${API_URL}/works/${isWork ? "work" : "volume"}/${isWork ? item.works_id : item.vol_id}`;
    const bodyData = isWork
      ? { works_id: item.works_id, users_id: infos.id }
      : { volumes_id: item.vol_id, users_id: infos.id };

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <button onClick={handleRemove} className={styles.btnAlert}>
      Supprimer
    </button>
  );
};

ButtonRemove.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
};

export { ButtonRemove };
