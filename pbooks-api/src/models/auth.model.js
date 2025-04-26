import pool from "../config/db.js";

class Auth {
  //============================== SELECT =======================================//

  // Vérifie si l'email existe déjà dans la base de données
  static async findUserForAuth(email) {
    const SELECT_USER = `
      SELECT id, email, pseudo, password, role, avatar, theme, status
      FROM users
      WHERE email = ?
    `;
    return await pool.query(SELECT_USER, [email]);
  }

  //============================== INSERT =======================================//

  // Crée un nouvel utilisateur dans la base de données
  static async createUser({ email, pseudo, password }) {
    const INSERT_USER = `INSERT INTO users (email, pseudo, password) VALUES (?, ?, ?)`;
    return await pool.execute(INSERT_USER, [email, pseudo, password]);
  }
}

export default Auth;
