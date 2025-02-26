import pool from "../config/db.js";

class Review {
  //============================== SELECT =======================================//

  static async findByVolumes(id) {
    const FIND_BY_VOLUMES = `SELECT 
        reviews.id AS id,
        reviews.score AS score,
        reviews.comment AS comment,
        reviews.created_at AS created_at,
        users.pseudo AS pseudo
      FROM reviews
      LEFT JOIN users ON users.id = reviews.users_id
      WHERE reviews.volumes_id = ?
      ORDER BY reviews.created_at DESC`;
    return await pool.query(FIND_BY_VOLUMES, [id]);
  }

  //============================== INSERT =======================================//

  static async addReview({ score, comment, users_id, volumes_id }) {
    const ADD_REVIEW = `INSERT INTO reviews (score, comment, users_id, volumes_id) VALUES (?, ?, ?, ?)`;
    return await pool.execute(ADD_REVIEW, [
      score,
      comment,
      users_id,
      volumes_id,
    ]);
  }

  //============================== UPDATE =======================================//

  static async updateScore({ score, id }) {
    const UPDATE_SCORE = `UPDATE reviews SET score = ? WHERE id = ?`;
    return await pool.execute(UPDATE_SCORE, [score, id]);
  }

  static async updateComment({ comment, id }) {
    const UPDATE_COMMENT = `UPDATE reviews SET comment = ? WHERE id = ?`;
    return await pool.execute(UPDATE_COMMENT, [comment, id]);
  }

  //============================== DELETE =======================================//

  static async deleteReview({ id }) {
    const DELETE_REVIEW = `DELETE FROM reviews WHERE id = ?`;
    return await pool.execute(DELETE_REVIEW, [id]);
  }
}
export default Review;
