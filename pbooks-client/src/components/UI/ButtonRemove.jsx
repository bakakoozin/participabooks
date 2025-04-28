import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";

import { useCanEditVolume } from "../../hooks/useCanEditVolume";
import { ConfirmModal } from "./ConfirmModal";
import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonRemove = ({ item, type, onRemove, ariaLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const { infos } = useSelector((state) => state.auth);
  const { canEditVolume } = useCanEditVolume();

  const isWork = type === "work";
  // Vérification de l'élément à supprimer
  if (isWork) {
    const allVolumesEnAttente =
      item.volumes &&
      item.volumes.every((vol) => vol.vol_status === "en attente");
    if (!allVolumesEnAttente) return null;
    const isPrivileged = canEditVolume(item.volumes[0]);
    if (!isPrivileged) return null;
  } else {
    if (item.vol_status !== "en attente") return null;

    const isPrivileged = canEditVolume(item);

    if (!isPrivileged) return null;
  }
  
  // Fonction de suppression de l'élément avec vérification de connexion de l'utilisateur avant permission de suppression
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

  // if (!isLogged) return null;
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={styles.btnAlert}
        aria-label={ariaLabel}
      >
        Supprimer
      </button>
      
      {showModal && (
        <ConfirmModal
          message="Êtes-vous sûr de vouloir supprimer cet élément ?"
          onConfirm={handleConfirmRemove}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};

ButtonRemove.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  onRemove: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export { ButtonRemove };
