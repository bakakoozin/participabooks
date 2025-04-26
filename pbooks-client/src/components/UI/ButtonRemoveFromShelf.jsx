import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";

import { ConfirmModal } from "./ConfirmModal";
import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonRemoveFromShelf = ({ item, type, onRemove, ariaLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const { isLogged, infos } = useSelector((state) => state.auth);

  const isWork = type === "work";

  // Fonction pour gérer la suppression de l'élément de la bibliothèque
  async function handleConfirmRemove() {
    const url = `${API_URL}/user/shelf/${isWork ? "work" : "volume"}/${
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
      <button
        onClick={() => setShowModal(true)}
        className={styles.btnAlert}
        aria-label={ariaLabel}
      >
        Supprimer de ma bibliothèque
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

ButtonRemoveFromShelf.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  onRemove: PropTypes.func,
  ariaLabel: PropTypes.string,
};
export { ButtonRemoveFromShelf };
