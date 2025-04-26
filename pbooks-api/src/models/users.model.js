import pool from "../config/db.js";

class User {
  //============================== SELECT =======================================//

  // Récupère tous les utilisateurs avec pagination et recherche
  static async findAll(search = "", page = 1, limit = 25) {
    const offset = (page - 1) * limit;

    // Requête principale pour récupérer les utilisateurs
    const MAIN_QUERY = `
      SELECT id, email, pseudo, created_at, role, status, avatar
      FROM users
      WHERE email LIKE CONCAT('%', ?, '%') OR pseudo LIKE CONCAT('%', ?, '%')
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Requête pour compter le nombre total d'utilisateurs correspondant à la recherche
    const COUNT_QUERY = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE email LIKE CONCAT('%', ?, '%') OR pseudo LIKE CONCAT('%', ?, '%')
    `;

    const mainParams = [search, search, limit, offset]; // Paramètres pour la requête principale
    const countParams = [search, search]; // Paramètres pour la requête de comptag

    // Exécute les requêtes
    const users = await pool.query(MAIN_QUERY, mainParams);
    const count = await pool.query(COUNT_QUERY, countParams);

    // Retourne les utilisateurs et le nombre total
    return {
      datas: users[0],
      count: count[0][0].total,
    };
  }

  // Récupère un utilisateur par son ID
  static async findOne(id) {
    const SELECT_USER = `SELECT id, email, pseudo, created_at, role, avatar, theme, status
FROM users WHERE id = ?`;
    return await pool.query(SELECT_USER, [id]);
  }

  // Recherche des utilisateurs par différents paramètres
  static async findBySearch(search) {
    const SEARCH_USER = `SELECT id, email, pseudo, created_at, role, avatar, status
    FROM users
    WHERE pseudo LIKE ?
      OR email LIKE ?
      OR created_at LIKE ?
      OR role LIKE ?
      OR status LIKE ?
  `;
    return await pool.query(SEARCH_USER, [
      search,
      search,
      search,
      search,
      search,
    ]);
  }

  //============================== UPDATE =======================================//

  // Effectue une mise à jour générique dans la table `users`
  static async update(query, values) {
    const connection = await pool.getConnection(); // Récupère une connexion à la base de données
    try {
      await connection.beginTransaction(); // Démarre une transaction
      const [result] = await connection.execute(query, values); // Exécute la requête
      await connection.commit(); // Valide la transaction
      return { success: "Mise à jour réussie.", result };
    } catch (error) {
      await connection.rollback(); // Annule la transaction en cas d'erreur
      return { error: "Erreur lors de la mise à jour.", details: error };
    } finally {
      connection.release(); // Libère la connexion
    }
  }

  // Met à jour le thème d'un utilisateur
  static async userTheme(theme, id) {
    const UPDATE_THEME = `UPDATE users SET theme = ? WHERE id = ?`;
    return await pool.execute(UPDATE_THEME, [theme, id]);
  }

  // Met à jour l'avatar d'un utilisateur
  static async updateAvatar(avatar, id) {
    const UPDATE_AVATAR = `UPDATE users SET avatar = ? WHERE id = ?`;
    try {
      const [result] = await pool.execute(UPDATE_AVATAR, [avatar, id]);

      // Vérifie si la mise à jour a affecté une ligne
      if (result.affectedRows === 0) {
        return null; // Aucun utilisateur trouvé pour la mise à jour
      }
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      throw error; // Relance l'erreur pour la gérer ailleurs
    }
  }

  //============================== DELETE =======================================//

  // Supprime un utilisateur par son ID
  static async delete(id) {
    const DELETE_USER = `DELETE FROM users WHERE id =?`;
    return await pool.execute(DELETE_USER, [id]);
  }
}

export default User;
