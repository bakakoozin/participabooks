import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export function ProtectedRoute({ children }) {
	const { isLogged, isSessionChecked } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	if (!isSessionChecked) {
		return <p>Chargement...</p>;
	}

	if (!isLogged) {
		navigate("/auth/login");
		return null;
	}

	return children;
}

ProtectedRoute.propTypes = {
	children: PropTypes.node.isRequired,
};