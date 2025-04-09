import pool from "../config/db.js";

class Auth {
  //============================== SELECT =======================================//

  static async findUserForAuth(email) {
    const SELECT_USER = `SELECT
            id
            FROM users WHERE email = ?`;
    return await pool.query(SELECT_USER, [email]);
  }

  //============================== INSERT =======================================//

  static async createUser({ email, pseudo, password }) {
    const INSERT_USER = `INSERT INTO users (email, pseudo, password) VALUES (?, ?, ?)`;
    return await pool.execute(INSERT_USER, [email, pseudo, password]);
  }
}

export default Auth;
