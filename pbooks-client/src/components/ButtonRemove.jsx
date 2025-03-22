import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { API_URL } from "../utils/constants";

const ButtonRemove = ({ item, type }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);

  async function handleRemove() {
    const isWork = type === "work";
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
        console.log("Supprimé de la bibliothèque.");
      } else {
        console.error("Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }
  if (!isLogged || (type === "volume" && item.vol_status !== "en attente")) {
    return null;
  }

  return <button onClick={handleRemove}>Supprimer</button>;
};

ButtonRemove.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["work", "volume"]).isRequired,
};

export { ButtonRemove };
