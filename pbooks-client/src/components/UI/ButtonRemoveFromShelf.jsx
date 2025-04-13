import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { API_URL } from "../../utils/constants";
import styles from "../../assets/style/scss/Button.module.scss";

const ButtonRemoveFromShelf = ({ item, type, onRemove }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);

  async function handleRemoveFromShelf() {
    const isWork = type === "work";
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
        if (onRemove) {
          onRemove(item.vol_id || item.works_id);
        }
      } else {
        console.error(
          "Erreur lors de la suppression de la bibliothèque personnelle."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la bibliothèque personnelle:",
        error
      );
    }
  }
  if (!isLogged) return null;
  return (
    <button onClick={handleRemoveFromShelf} className={styles.btnAlert}>
      Supprimer de ma bibliothèque
    </button>
  );
};
ButtonRemoveFromShelf.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  onRemove: PropTypes.func,
};
export { ButtonRemoveFromShelf };
