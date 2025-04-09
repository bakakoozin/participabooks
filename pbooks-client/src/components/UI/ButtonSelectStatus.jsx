import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styles from "../../assets/style/scss/Button.module.scss";

export function ButtonSelectStatus({ item, onStatusUpdate }) {
  const { infos } = useSelector((state) => state.auth);

  if (!infos || !infos.role.match(/admin|moderator/)) {
    return null;
  }

  const toggleStatus = async () => {
    const newStatus = item.vol_status === "en attente" ? "validé" : "en attente";
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/works/volumes/${item.vol_id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        onStatusUpdate?.(newStatus);
      } else {
        console.error("Erreur lors de la mise à jour du statut.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={toggleStatus} className={styles.btnAlert}>
      {item.vol_status === "validé" ? "Mettre en attente de validation" : "Valider"}
    </button>
  );
}

ButtonSelectStatus.propTypes = {
  item: PropTypes.object.isRequired,
  onStatusUpdate: PropTypes.func,
};
