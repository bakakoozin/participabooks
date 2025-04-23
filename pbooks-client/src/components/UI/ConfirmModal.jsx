import PropTypes from "prop-types";
import styles from "../../assets/style/scss/Button.module.scss";

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <button onClick={onConfirm} className={styles.btnAlert}>
            Oui, supprimer
          </button>
          <button onClick={onCancel} className={styles.btnCancel}>
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
