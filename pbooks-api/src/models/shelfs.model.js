import pool from "../config/db.js";

class Shelf {
  //============================== SELECT =======================================//

  // Récupère tous les ouvrages d'un utilisateur avec pagination et recherche
  static async findAll(search = "", user_id, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Requête pour récupérer les ouvrages avec leurs informations
    const FIND_ALL_WORKS = `
      SELECT 
        works.id AS works_id, 
        works.name AS works_name,
        works.edition AS works_edition,
        works.type AS works_type,
        works.format AS works_format,
        COALESCE(GROUP_CONCAT(DISTINCT authors.name SEPARATOR ','), 'Inconnu') AS authors_name,
        (
          SELECT medias.url 
          FROM volumes
          LEFT JOIN medias ON medias.volumes_id = volumes.id
          WHERE volumes.works_id = works.id
          ORDER BY volumes.number ASC
          LIMIT 1
        ) AS cover_url
      FROM works
      LEFT JOIN volumes ON volumes.works_id = works.id
      LEFT JOIN volumes_authors ON volumes_authors.volumes_id = volumes.id
      LEFT JOIN authors ON authors.id = volumes_authors.authors_id
      LEFT JOIN shelfs ON shelfs.volumes_id = volumes.id
      WHERE shelfs.users_id = ?
      AND (
        works.name LIKE CONCAT('%', ?, '%')
        OR volumes.title LIKE CONCAT('%', ?, '%')
      )
      GROUP BY 
        works.id,
        works.name,
        works.edition,
        works.type,
        works.format
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Requête pour compter le nombre total d'ouvrages correspondant à la recherche
    const COUNT_QUERY = `
      SELECT COUNT(DISTINCT works.id) AS total
      FROM works
      LEFT JOIN volumes ON volumes.works_id = works.id
      LEFT JOIN shelfs ON shelfs.volumes_id = volumes.id
      WHERE shelfs.users_id = ?
      AND (
        works.name LIKE CONCAT('%', ?, '%')
        OR volumes.title LIKE CONCAT('%', ?, '%')
      )
    `;

    const params = [user_id, search, search]; // Paramètres pour les requêtes

    // Exécute les requêtes
    const [datas] = await pool.query(FIND_ALL_WORKS, params);
    const [countResult] = await pool.query(COUNT_QUERY, params);

    // Retourne les données et le nombre total d'ouvrages
    return {
      datas: datas,
      count: countResult[0].total,
    };
  }

  // Récupère un ouvrage spécifique d'un utilisateur
  static async findOne({ users_id, works_id }) {
    const FIND_ONE_WORK = `SELECT 
        works.id AS works_id, 
        works.name AS works_name,
        works.edition AS works_edition,
        works.type AS works_type,
        works.format AS works_format,
        volumes.id AS vol_id,
        volumes.number AS vol_num,
        volumes.title AS vol_title,
        volumes.isbn AS vol_isbn,
        volumes.summary AS vol_summary,
        volumes.status AS vol_status,
        shelfs.status AS vol_status_user,
        volumes.created_at AS created_at,
        volumes.creator_visibility AS creator_visibility,
        users.id AS user_id,
        COALESCE(GROUP_CONCAT(DISTINCT authors.name SEPARATOR ','), 'Inconnu') AS authors_name,
        medias.url AS url_media
      FROM works
      LEFT JOIN volumes ON volumes.works_id = works.id
      LEFT JOIN users ON volumes.users_id = users.id
      LEFT JOIN volumes_authors ON volumes_authors.volumes_id = volumes.id
      LEFT JOIN authors ON authors.id = volumes_authors.authors_id
      LEFT JOIN medias ON medias.volumes_id = volumes.id
      LEFT JOIN shelfs ON shelfs.volumes_id = volumes.id AND shelfs.users_id = ?
      WHERE shelfs.users_id = ? AND works.id = ?
      GROUP BY volumes.id, works.id, users.id, medias.url
      ORDER BY vol_num;`; // Trie par numéro de volume
    return await pool.query(FIND_ONE_WORK, [users_id, works_id]);
  }

  //============================== INSERT =======================================//

  // Ajoute un volume à la bibliothèque personnelle d'un utilisateur
  static async insertVolume({ users_id, volumes_id }) {
    const INSERT_VOLUME = `INSERT INTO shelfs (users_id, volumes_id) VALUES (?, ?)`;
    return await pool.execute(INSERT_VOLUME, [users_id, volumes_id]);
  }

  //============================== UPDATE =======================================//

  // Met à jour le statut d'un volume dans la bibliothèque personnelle d'un utilisateur
  static async updateStatus({ status, volumes_id, users_id }) {
    const UPDATE_STATUS = `
      UPDATE shelfs
      SET status = ?
      WHERE volumes_id = ? AND users_id = ?
    `;
    return await pool.execute(UPDATE_STATUS, [status, volumes_id, users_id]);
  }

  //============================== DELETE =======================================//

  // Supprime un volume de la bibliothèque personnelle d'un utilisateur
  static async deleteVolume(volumes_id, users_id) {
    const DELETE_VOLUME = `DELETE FROM shelfs WHERE volumes_id = ?
    AND users_id = ?`;
    return await pool.execute(DELETE_VOLUME, [volumes_id, users_id]);
  }

  // Supprime tous les volumes d'un ouvrage de la bibliothèque personnelle d'un utilisateur
  static async deleteAllVolumes(works_id, users_id) {
    const DELETE_ALL_VOLUMES = `DELETE FROM shelfs
    WHERE volumes_id IN (
        SELECT id FROM volumes WHERE works_id = ?
      ) AND users_id = ?`;
    return await pool.execute(DELETE_ALL_VOLUMES, [works_id, users_id]);
  }
}

export default Shelf;
