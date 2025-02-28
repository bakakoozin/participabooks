// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { infos } = useSelector((state) => state.auth);
    // const [toggleModal, setToggleModal] = useState(false);

    async function handleDeleteAccount() {
        if (confirm("Etes-vous sûr de vouloir supprimer votre compte ?")) {
            try {
                const response = await fetch(`${API_URL}/profile`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    dispatch(logout());
                    navigate("/");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données.", error);
            }
        }
    }

    return (
		<div>
			<h2>Profil</h2>
			{infos && (
				<section>
					<h3>Informations personnelles</h3>
					<p>
						<strong>Pseudo :</strong> {infos.pseudo}
					</p>
					<p>
						<strong>Email :</strong> {infos.email}
					</p>
                    <Link to={"/update-infos"} className="cta">Mettre à jour vos informations</Link>
                    <button onClick={handleDeleteAccount}>Supprimer votre compte</button>
				</section>
			)}
		</div>
	);
}

export default Dashboard;