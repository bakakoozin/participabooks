import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_URL } from "../utils/constants";
import { updateAvatar } from "../features/authSlice";

export function FormAvatar() {
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const { infos } = useSelector((state) => state.auth);

  function handleFile(e) {
    setAvatarFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!avatarFile) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    formData.append("id", infos.id);
    try {
      const response = await fetch(`${API_URL}/user/profile/avatar`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        const avatarUrl = await response.text();
        dispatch(updateAvatar(avatarUrl));
        toast.success("Avatar mis à jour avec succès !");
      } else {
        const resJSON = await response.json();
        toast.error(
          resJSON.message ||
            "Échec de la mise à jour de l'avatar. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      toast.error(
        "Erreur lors de la mise à jour de l'avatar. Veuillez réessayer."
      );
    }
  }

  return (
    <article>
      <h3>Avatar</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          onChange={handleFile}
        />
        <button type="submit">Envoyer</button>
      </form>
    </article>
  );
}
