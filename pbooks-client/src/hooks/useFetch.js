import { useEffect, useState } from "react";
import { API_URL } from "../utils/constants";
import { useDebounce } from "./useDebounce";

export const useFetch = (url, { initData }) => {
  const [data, setData] = useState(initData);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const [isFetching, setIsFetching] = useState(false);

  async function fetcher() {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await fetch(`${API_URL}${url}?q=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.status === 401) {
        console.error("Non autorisé. Vérifiez votre authentification !");
        return;
      }
      if (res.ok) {
        setData(await res.json());
      } else {
        console.error("Erreur serveur:", res.status);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    fetcher();
  }, [searchDebounced]);

  return { fetcher, search, setSearch, data, isFetching };
};
