import pool from "../config/db.js";

class Media {
  //============================== INSERT =======================================//

  static async insertMedia({ volumes_id, url }) {
    const INSERT_MEDIA = `INSERT INTO medias (volumes_id, url) VALUES (?, ?)`;
    return await pool.execute(INSERT_MEDIA, [volumes_id, url]);
  }

  //============================== UPDATE =======================================//
  static async updateMedia({ volumes_id, url }) {
    const INSERT_MEDIA = `UPDATE medias SET url WHERE volumes_id = ?`;
    return await pool.execute(INSERT_MEDIA, [volumes_id, url]);
  }
}

export default Media;
