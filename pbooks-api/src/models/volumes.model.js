import pool from "../config/db.js";

class Volume {
  //============================== SELECT =======================================//

  static async findAllByWorkId(works_id) {
    const FIND_ALL_VOLUMES = `
    SELECT id FROM volumes WHERE works_id = ?
  `;
    const [rows] = await pool.query(FIND_ALL_VOLUMES, [works_id]);
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
        COALESCE(GROUP_CONCAT(DISTINCT authors.name SEPARATOR ','), 'Inconnu') AS authors_name
      FROM volumes
      LEFT JOIN volumes_authors ON volumes.id = volumes_authors.volumes_id
      LEFT JOIN authors ON authors.id = volumes_authors.authors_id
      WHERE volumes.id = ?
      GROUP BY volumes.id`;
    try {
      const [rows] = await pool.query(FIND_VOLUME, [volumeId]);
      const volume = rows[0];
      return {
        ...volume,
        authors_name: volume.authors_name ? volume.authors_name.split(",") : [],
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du volume:", error);
      throw error;
    }
  }

  static async isbnExist(isbn) {
    const FIND_ISBN = `SELECT COUNT(id) FROM volumes WHERE isbn = ?`;
    const [rows] = await pool.query(FIND_ISBN, [isbn]);
    const count = rows[0]["COUNT(id)"];
    return count > 0;
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
    const INSERT_VOLUME = `INSERT INTO volumes (works_id, number, title, isbn, summary, creator_visibility, users_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(INSERT_VOLUME, [
      worksId ?? null,
      number ?? null,
      title ?? null,
      isbn ?? null,
      summary ?? null,
      creator_visibility ?? null,
      users_id ?? null,
    ]);
    return result.insertId; // Récupére l'ID du volume inséré
  }

  //============================== UPDATE =======================================//

  static async updateVolume({ volumesId, ...volumeData }) {
    const fieldsToUpdate = Object.entries(volumeData)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ?`);

    const UPDATE_VOLUME = `
      UPDATE volumes
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = ?
      `;
    const values = Object.values(volumeData).filter(
      (value) => value !== undefined
    );
    values.push(volumesId);
    try {
      const [result] = await pool.execute(UPDATE_VOLUME, values);

      if (result && result.affectedRows > 0) {
        return result;
      } else {
        throw new Error("Aucune modification effectuée.");
      }
    } catch (error) {
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
