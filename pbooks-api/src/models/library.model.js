import pool from "../config/db.js";

class Library {
  static async findAll() {
    const SELECT_ALL = "";
    return await pool.query(SELECT_ALL);
  }
}

export default Library;
