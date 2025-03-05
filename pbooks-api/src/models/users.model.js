import pool from "../config/db.js";

class User {

//============================== SELECT =======================================//

  static async findAll() {
    const SELECT_ALL = `SELECT id, email, pseudo, created_at, role, status, avatar
FROM users`;
    return await pool.query(SELECT_ALL);
  }

  static async findOne(id) {
    const SELECT_USER = `SELECT id, email, pseudo, created_at, role, avatar, theme, status
FROM users WHERE id = ?`;
    return await pool.query(SELECT_USER, [id]);
  }

  static async findBySearch(search) {
    const SEARCH_USER = `SELECT id, email, pseudo, created_at, role, avatar, status
        FROM users WHERE pseudo LIKE ?, email LIKE ?, created_at LIKE ?, role LIKE ?, status LIKE ?`;
    return await pool.query(SEARCH_USER, [search]);
  }

//============================== UPDATE =======================================//

  static async update(query, values) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(query, values);
      await connection.commit();
      return { success: "Mise à jour réussie.", result };
    } catch (error) {
      await connection.rollback();
      return { error: "Erreur lors de la mise à jour.", details: error };
    } finally {
      connection.release();
    }
  }

  static async updateAvatar(avatarUrl, id) {
    console.log("Tentative de mise à jour de l'avatar pour l'ID:", id, "avec l'URL:", avatarUrl);
  
    const UPDATE_AVATAR = `UPDATE users SET avatar = ? WHERE id = ?`;
    try {
      const [result] = await pool.execute(UPDATE_AVATAR, [avatarUrl, id]);
      console.log("Résultat de la mise à jour de l'avatar:", result);
  
      if (result.affectedRows === 0) {
        console.log("Aucune ligne affectée. Vérifie l'ID utilisateur.");
        return null;
      }
  
      console.log(`Avatar mis à jour pour l'utilisateur avec l'ID: ${id}`);
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      throw error;
    }
  }

//============================== DELETE =======================================//

  static async delete(id) {
    const DELETE_USER = `DELETE FROM users WHERE id =?`;
    return await pool.execute(DELETE_USER, [id]);
  }
}

export default User;