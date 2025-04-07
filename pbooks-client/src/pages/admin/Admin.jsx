import { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import styles from "../../assets/style/scss/Admin.module.scss";

export function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok && data.datas) {
                setUsers(data.datas);
            } else {
                throw new Error(data.message || "Erreur lors de la récupération.");
            }
        } catch (error) {
            console.error(error);
            setError("Erreur lors du chargement des utilisateurs.");
        } finally {
            setLoading(false);
        }
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

    const updateRole = async (id, newRole) => {
        try {
            const res = await fetch("/admin/users", {
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
                    prev.map((user) => (user.id === id ? { ...user, role: newRole } : user))
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
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main className={styles.mainContainer}>
            <h2>Gestion des Utilisateurs</h2>
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchBar}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
                Rechercher</button>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Pseudo</th>
                        <th>Id</th>
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
                            <td>{pseudo}</td>
                            <td>{id}</td>
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
                                <button onClick={() => handleToggleStatus(status)}>
                                    {status === 1 ? "Bloquer" : "Activer"}
                                </button>
                                <button onClick={() => deleteUser(id)} style={{ marginLeft: "1rem" }}>
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
