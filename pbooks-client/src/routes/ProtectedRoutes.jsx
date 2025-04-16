import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export function ProtectedRoute({ children }) {
  const { isLogged, isSessionLogin } = useSelector((state) => state.auth);
  if (isSessionLogin) {
    return <p>Chargement...</p>;
  }

  if (!isLogged) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
