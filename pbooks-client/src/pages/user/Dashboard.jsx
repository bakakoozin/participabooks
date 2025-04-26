import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { ConfirmModal } from "../../components/UI/ConfirmModal";
import { logout } from "../../features/authSlice";
import { useTitle } from "../../hooks/useTitle";
import { API_URL } from "../../utils/constants";

import { ThemeToggle } from "../../components/UI/ButtonDarkMode";
import { FormAvatar } from "../../components/FormAvatar";

import styles from "../../assets/style/scss/Dashboard.module.scss";

export function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { infos } = useSelector((state) => state.auth);

  // Fonction de suppression de compte
  async function handleConfirmRemove() {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setShowModal(false);
        dispatch(logout());
        toast.success("Compte supprimé avec succès.");
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte.", error);
      toast.error("Erreur lors de la suppression du compte.");
    }
  }

  useTitle("Mon profil");

  return (
    <main className={styles.mainContainer}>
      <h2>Profil</h2>
      {/* Donnéees personnelles */}
      {infos && (
        <section>
          <article>
            <h3>Informations personnelles</h3>
            <p>
              <strong>Pseudo :</strong> {infos.pseudo}
            </p>
            <p>
              <strong>Email :</strong> {infos.email}
            </p>
            <div className={styles.btnContainer}>
              <Link to={"/update-infos"} className={styles.btn}>
                Mettre à jour mes informations
              </Link>
            </div>
          </article>
          <FormAvatar />
          {/* Choix de l'avatar */}
          <article>
            {infos.theme && <ThemeToggle defaultTheme={infos.theme} />}
          </article>
          {/* SUppression de compte */}
          <div>
            <button
              onClick={() => setShowModal(true)}
              className={styles.btnDelete}
            >
              Supprimer mon compte
            </button>
            {showModal && (
              <ConfirmModal
                message="Êtes-vous sûr de vouloir supprimer votre compte ?"
                onConfirm={handleConfirmRemove}
                onCancel={() => setShowModal(false)}
              />
            )}
          </div>
        </section>
      )}
    </main>
  );
}
