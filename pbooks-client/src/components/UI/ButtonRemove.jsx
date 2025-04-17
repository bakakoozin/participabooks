import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";
import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonRemove = ({ item, type, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const { isLogged, infos } = useSelector((state) => state.auth);
  const { canEditVolume } = useCanEditVolume();

  const isWork = type === "work";

  if (!isLogged) return null;

  if (isWork) {
    const allVolumesEnAttente =
      item.volumes &&
      item.volumes.every((vol) => vol.vol_status === "en attente");

    if (!allVolumesEnAttente) return null;

    const isCreator = item.users_id === infos?.id;
    const isPrivileged = canEditVolume(item);

    if (!isCreator && !isPrivileged) return null;
  } else {
    if (item.vol_status !== "en attente") return null;

    const isCreator = infos?.id === item.user_id;
    const isPrivileged = canEditVolume(item);

    if (!isCreator && !isPrivileged) return null;
  }

  async function handleConfirmRemove() {
    const url = `${API_URL}/works/${isWork ? "work" : "volume"}/${
      isWork ? item.works_id : item.vol_id
    }`;

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

      if (response.ok) {
        onRemove?.(item.vol_id || item.works_id);
        setShowModal(false);
      } else {
        console.error("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }

  if (!isLogged) return null;

  return (
    <>
      <button onClick={() => setShowModal(true)} className={styles.btnAlert}>
        Supprimer
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
            <div className={styles.modalActions}>
              <button onClick={handleConfirmRemove} className={styles.btnAlert}>
                Oui, supprimer
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={styles.btnCancel}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ButtonRemove.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  onRemove: PropTypes.func,
};

export { ButtonRemove };
