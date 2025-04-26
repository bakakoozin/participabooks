import PropTypes from "prop-types";
import styles from "../../assets/style/scss/Button.module.scss";

// Modal de validation de suppression
export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button
            onClick={onConfirm}
            className={styles.btnAlert}
            aria-label="Confirmer la suppression"
          >
            Oui, supprimer
          </button>
          <button
            onClick={onCancel}
            className={styles.btnCancel}
            aria-label="Annuler la suppression"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
