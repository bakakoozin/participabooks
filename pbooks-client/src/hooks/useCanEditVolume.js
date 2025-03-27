import { useSelector } from "react-redux";

export function useCanEditVolume() {
  const { infos } = useSelector((state) => state.auth);
  const canEditVolume = (volume) => {
    if (infos?.role.match(/admin|moderator/)) return true;
    return volume.vol_status !== "en attente" && volume.user_id !== infos?.id;
  };
  return { canEditVolume };
}
