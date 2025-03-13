import { useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import PropTypes from "prop-types";

const ButtonAddToShelf = ({ work }) => {
  const { isLogged, users_id } = useSelector((state) => state.auth);
  async function handleAddWorkToShelf() {
    try {
      const response = await fetch(`${API_URL}/user/shelf/work`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ works_id: work.works_id, users_id }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Ajouté à la bibliothèque personnelle");
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
    <button onClick={handleAddWorkToShelf}>Ajouter à ma bibliothèque</button>
  );
};
ButtonAddToShelf.propTypes = {
  work: PropTypes.object.isRequired,
};
export { ButtonAddToShelf };
