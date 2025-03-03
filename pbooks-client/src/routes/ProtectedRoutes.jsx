import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { login, logout } from "../features/authSlice";
import { API_URL } from "../utils/constants";

function ProtectedRoute({ children }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isVerifying, setIsVerifying] = useState(true);
	const { isLogged } = useSelector((state) => state.auth);

	useEffect(() => {
		// Vérification obligatoire si non loggé
		async function checkToken() {
			try {
				const response = await fetch(`${API_URL}/auth/session"`, {
					method: "GET",
					credentials: "include",
				});

				if (response.ok) {
					const data = await response.json();
					dispatch(login(data.user));
				} else {
					dispatch(logout());
					navigate("/auth/login");
				}
			} catch (error) {
				console.error("Echec TOKEN", error);
				dispatch(logout());
				navigate("/auth/login");
			} finally {
				setIsVerifying(false);
			}
		}

		// Si Redux dit qu'on est loggé, on ne refait pas la requête API
		if (isLogged) {
			setIsVerifying(false);
		} else {
			checkToken();
		}
	}, [isLogged]);

	if (isVerifying) {
		return <p>Chargement...</p>;
	}

	return children;
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ProtectedRoute;