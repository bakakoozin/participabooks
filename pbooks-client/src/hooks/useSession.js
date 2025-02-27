import { useEffect } from "react";
import { API_URL, TOKEN } from "../utils/constants";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";

export function useSession() {
  const dispatch = useDispatch();

  const getSession = async () => {
    const token = localStorage.getItem(TOKEN);
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      const resJSON = await response.json();
      dispatch(login(resJSON));
      if (!response.ok) {
        throw new Error(resJSON.message);
      }
    } catch (error) {
      console.error("Error fetching session", error);
    }
  };
  useEffect(() => {
    getSession();
  }, []);
}
