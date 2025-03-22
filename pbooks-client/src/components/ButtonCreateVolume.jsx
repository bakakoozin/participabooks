import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ButtonCreateVolume = ({ item }) => {
  const { isLogged, infos } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  if (
    !isLogged ||
    item.vol_status !== "en attente" ||
    item.user_id !== infos.id
  ) {
    return null;
  }

  const handleCreateVolume = () => {
    console.log(item.works_id);
    navigate(`/createVol/${item.works_id}`);
  };
  console.log(item.works_id);
  return <button onClick={handleCreateVolume}>Ajouter un volume</button>;
};

ButtonCreateVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonCreateVolume };
