import { useSelector } from "react-redux";

export function useCanEditVolume() {
  const { infos } = useSelector((state) => state.auth);

  const canEditVolume = (volume) => {
    if (!infos) return false;

    const isAdminOrMod = infos.role === "admin" || infos.role === "moderator";
    const isCreatorAndPending = volume.vol_status === "en attente" && volume.user_id === infos.id;

    return isAdminOrMod || isCreatorAndPending;
  };

  return { canEditVolume };
}