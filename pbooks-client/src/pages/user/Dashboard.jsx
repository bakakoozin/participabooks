import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout, login } from "../../features/authSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { FormAvatar } from "../../components/FormAvatar";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infos } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState(infos.theme);

  async function handleThemeChange(newTheme) {
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
    handleThemeChange(newTheme);
  }

  async function handleDeleteAccount() {
    if (confirm("Etes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          dispatch(logout());
          toast.success("Compte supprimé avec succès.");
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du compte.", error);
      }
    }
  }

  return (
    <div>
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
            <Link to={"/update-infos"} className="cta">
              Mettre à jour vos informations
            </Link>
          </article>
          <article>
            <label>
              Mode sombre :
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="theme-toggle"
                  checked={theme === "sombre"}
                  onChange={toggleTheme}
                />
                <label htmlFor="theme-toggle" className="toggle-label">
                  <span className="toggle-inner" />
                  <span className="toggle-switch" />
                </label>
              </div>
            </label>
          </article>
          <FormAvatar />
          <div>
            <button onClick={handleDeleteAccount}>
              Supprimer votre compte
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
