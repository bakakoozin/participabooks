import { useSelector } from "react-redux";
import { API_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ButtonEditWork = ({ item, type }) => {
    const { isLogged, infos } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    console.log("🔍 Contenu de item :", item);
    console.log("🔍 Vérification des conditions d'affichage du bouton :");
console.log("isLogged :", isLogged);
console.log("item.status :", item.vol_status);
console.log("item.users_id :", item.user_id);
console.log("infos.id :", infos.id);
console.log("Comparaison (status) :", item.vol_status === "en attente");
console.log("Comparaison (users_id) :", item.user_id === infos.id);

    // Vérification des conditions d'affichage du bouton
    if (!isLogged || item.vol_status !== "en attente" || Number(item.user_id) !== Number(infos.id)) {
        return null;
    }

    async function handleEditWork() {
        const isWork = type === "work";
        const url = `${API_URL}/user/shelf/${isWork ? "work" : "volume"}`;
        const bodyData = {
            works_id: isWork ? String(item.works_id) : undefined,
            volumes_id: !isWork ? String(item.vol_id) : undefined,
            user_id: String(infos.id),
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout à la bibliothèque");
            }

            console.log("Ajouté à la bibliothèque personnelle");
            navigate(`/edit/${item.vol_id}/${infos.id}`);
        } catch (error) {
            console.error("Erreur :", error.message);
        }
    }
    console.log("🔍 Le bouton devrait s'afficher ici");
    return <button onClick={handleEditWork}>Éditer</button>;
};

ButtonEditWork.propTypes = {
    item: PropTypes.shape({
        works_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        vol_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        vol_status: PropTypes.string.isRequired,
        user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    type: PropTypes.oneOf(["work", "volume"]).isRequired,
};

export { ButtonEditWork };
