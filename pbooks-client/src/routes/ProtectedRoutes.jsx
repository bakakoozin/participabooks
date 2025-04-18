import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export function ProtectedRoute({ children }) {
  const { loading, noSession } = useSelector((state) => state.auth);
  if (loading) {
    return <p style={{marginTop:"200px"}}>Chargement...</p>;
  }
if (noSession) {
    return <p style={{marginTop:"200px"}} >{"Vous n'êtes pas connecté"}</p>;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
