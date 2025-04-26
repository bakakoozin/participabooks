import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { API_URL } from "../../utils/constants";
import { useTitle } from "../../hooks/useTitle";

import { ConfirmModal } from "../../components/UI/ConfirmModal";
import { Pagination } from "../../components/Pagination";

import styles from "../../assets/style/scss/Admin.module.scss";

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const { infos } = useSelector((state) => state.auth);

  // Fonction pour récupérer la liste des utilisateurs
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

  // Fonction pour mettre à jour le rôle d'un utilisateur
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

  // Fonction pour gérer le changement de statut d'un utilisateur
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

  // Fonction pour gérer la recherche d'un utilisateur
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

  const confirmRemoveUser = (user) => {
    setUserToRemove(user);
    setShowRemoveModal(true);
  };

  // Fonction pour gérer la suppression d'un utilisateur 
  const handleRemoveConfirmed = async () => {
    if (!userToRemove?.id) {
      console.error("Aucun ID utilisateur à supprimer.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: userToRemove.id }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userToRemove.id));
        toast.success(`Utilisateur "${userToRemove.pseudo}" supprimé.`);
      } else {
        toast.error(data.message || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression.");
    } finally {
      setShowRemoveModal(false);
      setUserToRemove(null);
    }
  };

  useTitle("Admin");
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) return <p className={styles.loading}>Chargement...</p>;

  if (infos?.role !== "admin") {
    return (
      <p className={styles.message}>
        {"Accès refusé. Vous n'avez pas les droits d'administrateur."}
      </p>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h2>Gestion des Utilisateurs</h2>
      <Pagination totalPages={totalPages} />

      <div className={styles.searchControls}>
        <label htmlFor="searchInput" className={styles.hiddenLabel}>
          Rechercher un utilisateur
        </label>
        <input
          id="searchInput"
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
            <th className={styles.hideMobile}>ID</th>
            <th className={styles.hideMobile}>Pseudo</th>
            <th className={styles.hideMobile}>Date de création</th>
            <th>Rôle</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email, pseudo, role, created_at, status }) => (
            <tr key={id}>
              <td>{email}</td>
              <td className={styles.hideMobile}>{id}</td>
              <td className={styles.hideMobile}>{pseudo}</td>
              <td className={styles.hideMobile}>
                {new Date(created_at).toLocaleDateString()}
              </td>
              <td>{role}</td>
              <td>{status}</td>
              <td>
                <div className={styles.actions}>
                  {infos?.id === id ? (
                    <i>Actions désactivées pour le compte admin</i>
                  ) : (
                    <>
                      <select
                        value={role}
                        onChange={(e) => updateRole(id, e.target.value)}
                      >
                        <option value="user">Utilisateur</option>
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleToggleStatus({ id, status })}
                      >
                        {status === "actif" ? "Bloquer" : "Activer"}
                      </button>
                      <button onClick={() => confirmRemoveUser({ id, pseudo })}>
                        Supprimer
                      </button>
                      {showRemoveModal && (
                        <ConfirmModal
                          message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToRemove?.pseudo}" ?`}
                          onConfirm={handleRemoveConfirmed}
                          onCancel={() => setShowRemoveModal(false)}
                        />
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
