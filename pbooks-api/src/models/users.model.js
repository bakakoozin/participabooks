import pool from "../config/db.js";

class User {
  //============================== SELECT =======================================//

  static async findAll(search = "", page = 1, limit = 25) {
    const offset = (page - 1) * limit;

    const MAIN_QUERY = `
      SELECT id, email, pseudo, created_at, role, status, avatar
      FROM users
      WHERE email LIKE CONCAT('%', ?, '%') OR pseudo LIKE CONCAT('%', ?, '%')
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const COUNT_QUERY = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE email LIKE CONCAT('%', ?, '%') OR pseudo LIKE CONCAT('%', ?, '%')
    `;

    const mainParams = [search, search, limit, offset];
    const countParams = [search, search];

    const users = await pool.query(MAIN_QUERY, mainParams);
    const count = await pool.query(COUNT_QUERY, countParams);

    return {
      datas: users[0],
      count: count[0][0].total,
    };
  }

  static async findOne(id) {
    const SELECT_USER = `SELECT id, email, pseudo, created_at, role, avatar, theme, status
FROM users WHERE id = ?`;
    return await pool.query(SELECT_USER, [id]);
  }

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

  static async userTheme(theme, id) {
    const UPDATE_THEME = `UPDATE users SET theme = ? WHERE id = ?`;
    return await pool.execute(UPDATE_THEME, [theme, id]);
  }

  static async updateAvatar(avatar, id) {
    const UPDATE_AVATAR = `UPDATE users SET avatar = ? WHERE id = ?`;
    try {
      const [result] = await pool.execute(UPDATE_AVATAR, [avatar, id]);

      if (result.affectedRows === 0) {
        return null;
      }
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
