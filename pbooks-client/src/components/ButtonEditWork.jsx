import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ButtonEditWork = ({ item }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  if (!isLogged || item.vol_status !== "en attente" || item.user_id !== infos.id) {
    return null;
  }

  const handleEditWork = () => {
    navigate(`/editor/${item.works_id}`);
  };

  return <button onClick={handleEditWork}>Éditer</button>;
};

ButtonEditWork.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonEditWork };
