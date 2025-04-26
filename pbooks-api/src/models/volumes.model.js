import pool from "../config/db.js";

class Volume {
  //============================== SELECT =======================================//

  // Récupère tous les volumes associés à un ouvrage spécifique
  static async findAllByWorkId(works_id) {
    const FIND_ALL_VOLUMES = `
    SELECT id FROM volumes WHERE works_id = ?
  `;
    const [rows] = await pool.query(FIND_ALL_VOLUMES, [works_id]);
    // Retourne un tableau contenant les IDs des volumes
    return rows.map((row) => row.id);
  }

  // Récupère les détails d'un volume spécifique par son ID
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
      // Retourne les détails du volume, avec les auteurs sous forme de tableau
      return {
        ...volume,
        authors_name: volume.authors_name ? volume.authors_name.split(",") : [],
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du volume:", error);
      throw error;
    }
  }

  // Vérifie si un ISBN existe déjà dans la base de données
  static async isbnExist(isbn) {
    const FIND_ISBN = `SELECT COUNT(id) FROM volumes WHERE isbn = ?`;
    const [rows] = await pool.query(FIND_ISBN, [isbn]);
    const count = rows[0]["COUNT(id)"];
    // Retourne `true` si l'ISBN existe, sinon `false`
    return count > 0;
  }

  //============================== INSERT =======================================//

  // Insère un nouveau volume dans la base de données
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
    // Retourne l'ID du volume inséré
    return result.insertId;
  }

  //============================== UPDATE =======================================//

  // Met à jour les informations d'un volume existant
  static async updateVolume({ volumesId, ...volumeData }) {
    // Génère dynamiquement les champs à mettre à jour
    const fieldsToUpdate = Object.entries(volumeData)
      .filter(([key, value]) => value !== undefined) // Ignore les champs non définis
      .map(([key, value]) => `${key} = ?`);

    const UPDATE_VOLUME = `
      UPDATE volumes
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = ?
      `;
    const values = Object.values(volumeData).filter(
      (value) => value !== undefined
    );
    values.push(volumesId); // Ajoute l'ID du volume à la fin des valeurs
    try {
      const [result] = await pool.execute(UPDATE_VOLUME, values);

      if (result && result.affectedRows > 0) {
        // Retourne le résultat si la mise à jour a été effectuée
        return result;
      } else {
        throw new Error("Aucune modification effectuée.");
      }
    } catch (error) {
      throw error;
    }
  }

  // Met à jour le statut d'un volume (par exemple, "en cours", "terminé", etc.)
  static async updateStatus(status, id) {
    const UPDATE_STATUS = "UPDATE volumes SET status = ? WHERE id = ?";
    return await pool.execute(UPDATE_STATUS, [status, id]);
  }

  //============================== DELETE =======================================//

  // Supprime un volume de la base de données par son ID
  static async deleteVolume(id) {
    const DELETE_VOLUME = `DELETE FROM volumes WHERE id =?`;
    return await pool.execute(DELETE_VOLUME, [id]);
  }
}

export default Volume;
