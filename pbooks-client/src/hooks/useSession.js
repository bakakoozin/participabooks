import { useEffect } from "react";
import { API_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";

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
      const resJSON = await response.json();
      if (response.ok) {
        dispatch(login(resJSON.user));
      } else {
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
