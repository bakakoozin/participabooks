import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

import { API_URL } from "../../utils/constants";

import styles from "../../assets/style/scss/Button.module.scss";

const ButtonAddToShelf = ({ item, type, ariaLabel }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);

  // Vérifie si l'utilisateur est connecté
  async function handleAddToShelf() {
    const isWork = type === "work";
    const url = `${API_URL}/user/shelf/${isWork ? "work" : "volume"}`;
    const bodyData = isWork
      ? { works_id: item.works_id, users_id: infos.id }
      : { volumes_id: item.vol_id, users_id: infos.id };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Ajouté à ma bibliothèque");
      } else {
        console.error("Erreur lors de l'ajout à la bibliothèque personnelle");
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout à la bibliothèque personnelle:",
        error
      );
    }
  }
  if (!isLogged) return null;
  return (
    <button
      onClick={handleAddToShelf}
      className={styles.btn}
      aria-label={ariaLabel}
    >
      Ajouter à ma bibliothèque
    </button>
  );
};

ButtonAddToShelf.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
  ariaLabel: PropTypes.string,
};

export { ButtonAddToShelf };
