import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";

import { updateAvatar } from "../features/authSlice";
import { API_URL } from "../utils/constants";

import styles from "../assets/style/scss/Dashboard.module.scss";

export function FormAvatar() {
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Sélection d'un fichier image pour l'avatar.
  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);

      // Aperçu de l'image sélectionnée
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarFile(null);
      setPreview(null);
    }
  }

  // Soumission du formulaire pour mettre à jour l'avatar.
  async function handleSubmit(e) {
    e.preventDefault();
    if (!avatarFile) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", avatarFile);

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
        <div className={styles.btnContainer}>
          <label
            htmlFor="avatar"
            className={styles.btn}
            aria-label="Choisir un fichier image pour modifier votre avatar"
          >
            Choisir un fichier
          </label>
        </div>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          onChange={handleFile}
        />
        {preview && (
          <div className={styles.previewContainer}>
            <img
              src={preview}
              alt="Aperçu de l'avatar"
              className={styles.preview}
            />
          </div>
        )}
        <div className={styles.btnContainer}>
          {avatarFile && (
            <button
              className={styles.btn}
              type="submit"
              aria-label="Envoyer l'avatar"
            >
              Envoyer
            </button>
          )}
        </div>
      </form>
    </article>
  );
}
