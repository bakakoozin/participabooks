import pool from "../config/db.js";

class Author {
  //============================== SELECT =======================================//

  static async findByName(searchTerm) {
    const FIND_BY_NAME = `
        SELECT id, name FROM authors
        WHERE name LIKE ?
        ORDER BY name ASC
        LIMIT 10`;
    return await pool.execute(FIND_BY_NAME, [`%${searchTerm}%`]);
  }

  static async getAuthorsByVolumeId(volumesId) {
    const GET_AUTHORS = `
      SELECT autors.id, authors.name
      FROM authors
      JOIN volumes_authors ON authors.id = volume_authors.authors_id
      WHERE volumes_authors.volumes_id = ?`;
    return await pool.query(GET_AUTHORS, [volumesId]);
  }

  //============================== INSERT =======================================//

  static async findOrCreateAuthor(name) {
    const FIND_ONE = `SELECT id FROM authors WHERE name = ? LIMIT 1`;
    const [rows] = await pool.execute(FIND_ONE, [name]);

    if (rows.length > 0) {
      return rows[0].id;
    }

    const CREATE_AUTHOR = `INSERT INTO authors (name) VALUES (?)`;
    const [result] = await pool.execute(CREATE_AUTHOR, [name]);
    return result.insertId;
  }

  static async linkAuthorToVolume(volumeId, authorId) { //on écrit dans la table relationnelle volumes_authors
    const LINK_AUTHOR = `INSERT INTO volumes_authors (volumes_id, authors_id) VALUES (?, ?)`;
    await pool.execute(LINK_AUTHOR, [volumeId, authorId]);
  }

  //============================== DELETE =======================================//

  static async unlinkAuthorFromVolume(volumesId, authorId) { //on supprime de la table relationnelle volumes_authors
    const UNLINK_AUTHOR = `
      DELETE FROM volumes_authors
      WHERE volume_id = ? AND author_id = ?`;

    await pool.execute(UNLINK_AUTHOR, [volumesId, authorId]);
  }
}

export default Author;
