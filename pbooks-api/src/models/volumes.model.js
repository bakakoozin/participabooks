import pool from "../config/db.js";

class Volume {

  //============================== SELECT =======================================//

  static async findAllByWorkId(works_id) {
    const FIND_ALL_VOLUMES = `
    SELECT id FROM volumes WHERE works_id = ?
  `;
    const [rows] = await pool.query(FIND_ALL_VOLUMES, [works_id]);
    console.log("Volumes SQL trouvés:", rows);
    return rows.map((row) => row.id);
  }

  static async findById(volumeId) {
    const FIND_VOLUME = `
      SELECT 
        works_id, 
        number, 
        title, 
        isbn, 
        summary, 
        status, 
        created_at, 
        creator_visibility, 
        users_id,
        validator_id,
        authors.name AS author_name
      FROM volumes
      LEFT JOIN volumes_authors ON volumes.id = volumes_authors.volumes_id
      LEFT JOIN authors ON authors.id = volumes_authors.authors_id
      WHERE volumes_id = ?`;
    const [rows] = await pool.query(FIND_VOLUME, [volumeId]);
    return rows[0];
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

  static async updateVolume({ volumesId, volumeData }) {
    const { number, title, isbn, summary, creator_visibility } = volumeData;
    const UPDATE_VOLUME = `
  UPDATE volumes
  SET number = ?, title = ?, isbn = ?, summary = ?, creator_visibility = ?
  WHERE id = ?
  `;
    const [result] = await pool.execute(UPDATE_VOLUME, [
      number ?? null,
      title ?? null,
      isbn ?? null,
      summary ?? null,
      creator_visibility ?? null,
      volumesId
    ]);
    return result;
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