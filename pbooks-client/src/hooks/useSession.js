import { useEffect } from "react";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { login, setLoader, setNoSession } from "../features/authSlice";

const LS_THEME = "pb_theme";

export function useSession() {
  const dispatch = useDispatch();

  // Fonction pour récupérer la session utilisateur depuis l'API et le thème depuis le localStorage
  const getSession = async () => {
    const theme = localStorage.getItem(LS_THEME) || "clair";
    document.documentElement.setAttribute("data-theme", theme);
    dispatch(setLoader(true));

    const response = await fetch(`${API_URL}/auth/session`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const resJSON = await response.json();
    if (resJSON?.user?.id) {
      dispatch(login(resJSON.user));
      document.documentElement.setAttribute("data-theme", resJSON.user.theme);
      localStorage.setItem(LS_THEME, resJSON.user.theme);
    } else {
      dispatch(setNoSession(true));
    }

    dispatch(setLoader(false));
  };

  useEffect(() => {
    getSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dépendances vides : l'effet s'exécute uniquement au montage
}
