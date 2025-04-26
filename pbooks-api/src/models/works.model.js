import pool from "../config/db.js";

class Work {
  //============================== SELECT =======================================//

  // Récupère tous les ouvrages avec pagination et recherche
  static async findAll(search = "", user_id, page = 1, limit = 10) {
    const offset = (page - 1) * limit; // Calcule l'offset pour la pagination

    // Champs sélectionnés dans la requête principale
    const SELECT_FIELDS = `
      works.id AS works_id, 
      works.name AS works_name,
      works.edition AS works_edition,
      works.type AS works_type,
      works.format AS works_format,
      COALESCE(GROUP_CONCAT(DISTINCT authors.name ORDER BY authors.name SEPARATOR ','),
      'Inconnu') AS authors_name,
      (
        SELECT medias.url
        FROM volumes
        LEFT JOIN medias ON medias.volumes_id = volumes.id
        WHERE volumes.works_id = works.id
        ORDER BY volumes.number ASC
        LIMIT 1
      ) AS cover_url,
      JSON_ARRAYAGG(JSON_OBJECT(
        'vol_id', volumes.id,
        'vol_status', volumes.status,
        'user_id', volumes.users_id,
        'role', users.role
      )) AS volumes
    `;

    // Requête principale pour récupérer les ouvrages
    const MAIN_QUERY = `
      SELECT ${SELECT_FIELDS}
      FROM works
      LEFT JOIN volumes ON volumes.works_id = works.id
      LEFT JOIN users ON users.id = volumes.users_id
      LEFT JOIN volumes_authors ON volumes_authors.volumes_id = volumes.id
      LEFT JOIN authors ON authors.id = volumes_authors.authors_id
      WHERE (
        volumes.status = 'validé'
        OR users.role IN ('moderator', 'admin')
        OR users.id = ?
      )
      AND (
        works.name LIKE CONCAT('%', ?, '%')
        OR volumes.title LIKE CONCAT('%', ?, '%')
      )
      GROUP BY works.id
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Requête pour compter le nombre total d'ouvrages correspondant à la recherche
    const COUNT_QUERY = `
      SELECT COUNT(DISTINCT works.id) AS total
      FROM works
      LEFT JOIN volumes ON volumes.works_id = works.id
      LEFT JOIN users ON users.id = volumes.users_id
      WHERE (
        volumes.status = 'validé'
        OR users.role IN ('moderator', 'admin')
        OR users.id = ?
      )
      AND (
        works.name LIKE CONCAT('%', ?, '%')
        OR volumes.title LIKE CONCAT('%', ?, '%')
      )
    `;

    const params = [user_id, search, search]; // Paramètres pour les requêtes

    // Exécute les requêtes
    const datas = await pool.query(MAIN_QUERY, params);
    const count = await pool.query(COUNT_QUERY, params);

    // Retourne les ouvrages et le nombre total
    return {
      datas: datas[0],
      count: count[0][0].total,
    };
  }

  // Récupère un ouvrage spécifique par son ID
  static async findOne(id) {
    const SELECT_WORK = `SELECT 
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
          volumes.created_at AS created_at,
          volumes.creator_visibility AS creator_visibility,
          volumes.users_id AS user_id,
          COALESCE(GROUP_CONCAT(DISTINCT authors.name SEPARATOR ','), 'Inconnu') AS authors_name,
          medias.url AS url_media,
          COALESCE(AVG(reviews.score),0) AS vol_score
        FROM works 
        LEFT JOIN volumes ON volumes.works_id = works.id
        LEFT JOIN users ON volumes.users_id = users.id
        LEFT JOIN volumes_authors ON volumes_authors.volumes_id = volumes.id
        LEFT JOIN authors ON authors.id = volumes_authors.authors_id
        LEFT JOIN medias ON medias.volumes_id = volumes.id
        LEFT JOIN reviews ON reviews.volumes_id = volumes.id
        WHERE works.id = ?
        GROUP BY volumes.id, works.id, users.id, medias.url
        ORDER BY vol_num`;
    return await pool.query(SELECT_WORK, [id]);
  }

  // Recherche un ouvrage par ses propriétés (nom, édition, type, format)
  static async findWork({ name, edition, type, format }) {
    const FIND_WORK = `SELECT id FROM works WHERE name = ? AND edition = ? AND type = ? AND format = ? LIMIT 1`;
    const [rows] = await pool.execute(FIND_WORK, [name, edition, type, format]);
    return rows.length > 0 ? rows[0].id : null;
  }

  //============================== INSERT =======================================//

  // Insère un nouvel ouvrage dans la base de données
  static async insertWork({ name, edition, type, format }) {
    const INSERT_WORK = `INSERT INTO works (name, edition, type, format) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(INSERT_WORK, [
      name,
      edition,
      type,
      format,
    ]);
    return result.insertId; // Récupére l'ID de l'oeuvre insérée
  }

  // Trouve un ouvrage ou le crée s'il n'existe pas
  static async findOrCreateWork(props) {
    const worksId = await Work.findWork(props); // Recherche l'ouvrage
    return worksId || (await Work.insertWork(props)); // Insère l'ouvrage si non trouvé
  }

  //============================== UPDATE =======================================//

  // Met à jour les informations d'un ouvrage existant
  static async updateWork({ worksId, ...workData }) {
    // Génère dynamiquement les champs à mettre à jour
    const fieldsToUpdate = Object.entries(workData)
      .filter(([key, value]) => value !== undefined) // Ignore les champs non définis
      .map(([key, value]) => `${key} = ?`);

    const UPDATE_WORK = `
      UPDATE works
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = ?
      `;
    const values = Object.values(workData).filter(
      (value) => value !== undefined
    );
    values.push(worksId); // Ajoute l'ID de l'ouvrage à la fin des valeurs
    try {
      const [result] = await pool.execute(UPDATE_WORK, values);
      return result; // Retourne le résultat de la mise à jour
    } catch (error) {
      throw error; // Relance l'erreur pour la gérer ailleurs
    }
  }

  //============================== DELETE =======================================//

  // Supprime un ouvrage de la base de données par son ID
  static async deleteWork(id) {
    const DELETE_WORK = `DELETE FROM works WHERE id =?`;
    return await pool.execute(DELETE_WORK, [id]);
  }
}

export default Work;
