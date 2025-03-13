import pool from "../config/db.js";

class Volume {

//============================== SELECT =======================================//

static async findAllByWorkId(works_id) {
  const FIND_ALL_VOLUMES = `
    SELECT id FROM volumes WHERE works_id = ?
  `;
  const [rows] = await pool.query(FIND_ALL_VOLUMES, [works_id]);
  return rows;
}

//============================== INSERT =======================================//

  static async insertVolume({
    worksId,
    number,
    title,
    isbn,
    summary,
    creator_visibility,
    users_id,
  }) {
    console.log("Données insérées :", { worksId, number, title, isbn, summary, creator_visibility, users_id });
    const INSERT_VOLUME = 
      `INSERT INTO volumes (works_id, number, title, isbn, summary, creator_visibility, users_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.execute(INSERT_VOLUME, [
        worksId ?? null,
        number ?? null,
        title ?? null,
        isbn ?? null,
        summary ?? null,
        creator_visibility ?? null,
        users_id ?? null
      ]);
    return result.insertId; // Récupére l'ID du volume inséré
  }

//============================== UPDATE =======================================//

static async updateVolume({ volumesId, ...fields }) {
  try {
    const setClause = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    const QUERY = `UPDATE volumes SET ${setClause} WHERE id = ?`;
    await pool.execute(QUERY, [...values, volumesId]);
  } catch (error) {
    console.error("Erreur updateVolume:", error);
    throw error;
  }
}

static async updateStatus(status, id) {
  const UPDATE_STATUS = "UPDATE volumes SET status = ? WHERE id = ?";
  return await pool.execute(UPDATE_STATUS, [status, id]);
} 

//============================== DELETE =======================================//

  static async deleteVolume(id) {
    const DELETE_VOLUME = `DELETE FROM volumes WHERE id =?`;
    return await pool.execute(DELETE_VOLUME, [id]);
  }
}

export default Volume;