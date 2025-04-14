import { useSelector } from "react-redux";
import { useState } from "react";
import PropTypes from "prop-types";

import { API_URL } from "../../utils/constants";
import styles from "../../assets/style/scss/Button.module.scss";

const ButtonRemoveFromShelf = ({ item, type, onRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const { isLogged, infos } = useSelector((state) => state.auth);

  const isWork = type === "work";

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
      <button onClick={() => setShowModal(true)} className={styles.btnAlert}>
        Supprimer de ma bibliothèque
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

ButtonRemoveFromShelf.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  onRemove: PropTypes.func,
};
export { ButtonRemoveFromShelf };
