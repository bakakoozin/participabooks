import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout, login } from "../../features/authSlice";
import { setToken, refresh } from "../../features/refreshSlice";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { useEffect } from "react";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infos } = useSelector((state) => state.auth);
  const { needsRefresh } = useSelector((state) => state.refresh);
  const [theme, setTheme] = useState(infos.theme);
  const [avatarFile, setAvatarFile] = useState(null);

useEffect(() => {
  async function fetchNewToken() {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setToken(data.token));
      } else {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token.", error);
      dispatch(logout());
      navigate("/login");
    }
  }

  if (needsRefresh) {
    fetchNewToken();
    dispatch(refresh());
  }
  }, [needsRefresh, dispatch, navigate]);

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
        const resJSON = await response.json();
        dispatch(login({ ...infos, avatar: resJSON.avatar }));
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
