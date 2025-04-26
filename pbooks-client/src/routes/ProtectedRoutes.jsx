import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import styles from "../assets/style/scss/Form.module.scss";

export function ProtectedRoute({ children }) {
  const { loading, noSession } = useSelector((state) => state.auth);
  if (loading) {
    return <p className={styles.loading}>Chargement...</p>;
  }
if (noSession) {
    return <p className={styles.message}>{"Vous n'êtes pas connecté"}</p>;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
