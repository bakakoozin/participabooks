import pool from "../config/db.js";

class Media {
  //============================== SELECT =======================================//

  static async findByVolumeId(volumes_id) {
    const SELECT_MEDIA = `SELECT id, url, volumes_id FROM medias WHERE volumes_id = ? LIMIT 1`;
    const [rows] = await pool.execute(SELECT_MEDIA, [volumes_id]);
    return rows.length > 0 ? rows[0] : null;
  }

  //============================== INSERT =======================================//

  static async insertMedia({ volumes_id, url }) {
    const INSERT_MEDIA = `INSERT INTO medias (volumes_id, url) VALUES (?, ?)`;
    return await pool.execute(INSERT_MEDIA, [volumes_id, url]);
  }

  //============================== UPDATE =======================================//
  static async updateMedia({ volumes_id, url }) {
    const UPDATE_MEDIA = `UPDATE medias SET url = ? WHERE volumes_id = ?`;
    return await pool.execute(UPDATE_MEDIA, [url, volumes_id]);
  }
}

export default Media;
