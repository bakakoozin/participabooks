import { useEffect } from "react";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { login, setSessionChecked } from "../features/authSlice";

export function useSession() {
  const dispatch = useDispatch();

  const getSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const resJSON = await response.json();
        dispatch(login(resJSON.user));
      }
    } catch (error) {
      console.error("Error fetching session", error);
    } finally {
      dispatch(setSessionChecked(true));
    }
  };

  useEffect(() => {
    getSession();
  }, []);
}
