import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";

import { Pagination } from "../../components/Pagination";

import styles from "../../assets/style/scss/Admin.module.scss";

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { infos } = useSelector((state) => state.auth);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/admin/users?q=${search}&page=${page}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers(data.datas);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.message || "Erreur lors de la récupération.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, role: newRole }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
      } else {
        alert(data.message || "Erreur lors de la mise à jour du rôle.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === "actif" ? "bloqué" : "actif";
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchUsers();
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users/search?q=${search}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.datas);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    }
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);
    setSearchParams(params);
    await fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert(data.message || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  useTitle("Admin");
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) return <p>Chargement...</p>;

  if (infos?.role !== "admin") {
    return (
      <p>{"Accès refusé. Vous n'avez pas les droits d'administrateur."}</p>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h2>Gestion des Utilisateurs</h2>
      <Pagination totalPages={totalPages} />

      <div className={styles.searchControls}>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className={styles.searchBar}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Rechercher
        </button>
        <button
          onClick={() => {
            setSearch("");
            fetchUsers();
          }}
          className={styles.resetButton}
        >
          Afficher tous
        </button>
      </div>

      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>ID</th>
            <th>Pseudo</th>
            <th>Date de création</th>
            <th>Rôle</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email, pseudo, role, created_at, status }) => (
            <tr key={id}>
              <td>{email}</td>
              <td>{id}</td>
              <td>{pseudo}</td>
              <td>{new Date(created_at).toLocaleDateString()}</td>
              <td>{role}</td>
              <td>{status}</td>
              <td>
                <select
                  value={role}
                  onChange={(e) => updateRole(id, e.target.value)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="moderator">Modérateur</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => handleToggleStatus({ id, status })}>
                  {status === 1 ? "Bloquer" : "Activer"}
                </button>
                <button
                  onClick={() => deleteUser(id)}
                  disabled={infos?.id && id === infos.id}
                  title={
                    id === infos?.id
                      ? "Vous ne pouvez pas vous supprimer vous-même"
                      : ""
                  }
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
