import { useEffect, useState } from "react";
import { API_URL } from "../utils/constants";
import { useDebounce } from "./useDebounce";
import { useSearchParams } from "react-router-dom";

export const useFetch = (url, { initData }) => {
  const [data, setData] = useState(initData);
  const [search, setSearch] = useState("");
  const searchDebounced = useDebounce(search, 500);
  const [isFetching, setIsFetching] = useState(false);
  const [searchParams] = useSearchParams({ page: 1 });
  const page = parseInt(searchParams.get("page")) || 1;

  // Fonction pour effectuer la requête API
  async function fetcher() {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const res = await fetch(`${API_URL}${url}?q=${search}&page=${page}`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounced, page]);

  return { fetcher, search, setSearch, data, isFetching };
};
