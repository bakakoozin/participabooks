import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {  useState } from "react";
import { toast } from "react-toastify";

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
          <article>
            {infos.theme && <ThemeToggle defaultTheme={infos.theme} />}
          </article>
          <div>
            <button
              className={styles.btnDelete}
              onClick={() => setShowModal(true)}
            >
              Supprimer mon compte
            </button>
            {showModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
                  <div className={styles.modalActions}>
                    <button
                      onClick={handleConfirmRemove}
                      className={styles.btnAlert}
                    >
                      Oui, supprimer
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className={styles.btnCancel}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
