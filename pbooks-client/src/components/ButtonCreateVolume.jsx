import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useCanEditVolume } from "../hooks/useCanEditVolume";

const ButtonCreateVolume = ({ item }) => {
  const navigate = useNavigate();
  const { canEditVolume } = useCanEditVolume();

  const handleCreateVolume = () => {
    navigate(`/createVol/${item.works_id}`);
  };

  if (canEditVolume(item)) {
    return null;
  }
  return (
    <button onClick={handleCreateVolume} className="btn">
      Ajouter un volume
    </button>
  );
};

ButtonCreateVolume.propTypes = {
  item: PropTypes.object.isRequired,
};

export { ButtonCreateVolume };
