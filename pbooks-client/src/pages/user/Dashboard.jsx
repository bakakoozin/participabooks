import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { FormAvatar } from "../../components/FormAvatar";
import { ThemeToggle } from "../../components/UI/ButtonDarkMode";
import styles from "../../assets/style/scss/Dashboard.module.scss";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { infos } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(infos.theme);

  async function handleThemeChange(newTheme) {
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      const response = await fetch(`${API_URL}/user/profile/theme`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: newTheme, id: infos.id }),
        credentials: "include",
      });

      if (response.ok) {
        const resJSON = await response.json();
        dispatch(login({ ...infos, theme: resJSON.Theme }));
        setTheme(resJSON.theme);
      } else {
        console.error("Échec de la mise à jour du thème. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du thème.", error);
    }
  }

  function toggleTheme() {
    const newTheme = theme === "clair" ? "sombre" : "clair";

    if (newTheme === "sombre") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
 
    handleThemeChange(newTheme);
  }

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

  useEffect(() => {
    if (theme === "sombre") {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [theme]);

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
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
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

export default Dashboard;
