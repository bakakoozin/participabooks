import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ButtonEditVolume = ({ item }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  if (
    !isLogged ||
    item.vol_status !== "en attente" ||
    item.user_id !== infos.id
  ) {
    return null;
  }

  const handleEditVolume = () => {
    navigate(`/editVol/${item.vol_id}`);
  };

  return <button onClick={handleEditVolume}>Éditer</button>;
};

ButtonEditVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonEditVolume };
