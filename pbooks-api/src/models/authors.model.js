import pool from "../config/db.js";

class Author {
  //============================== SELECT =======================================//

  // Retourne une liste d'auteurs avec leur id et leur nom (PAS ENCORE UTILISE)
  static async findByName(searchTerm) {
    const FIND_BY_NAME = `
        SELECT id, name FROM authors
        WHERE name LIKE ?
        ORDER BY name ASC
        LIMIT 10`;
    return await pool.execute(FIND_BY_NAME, [`%${searchTerm}%`]);
  }

  // Retourne les auteurs d'un volume
  static async getAuthorsByVolumeId(volumesId) {
    const GET_AUTHORS = `
      SELECT authors.id, authors.name
      FROM authors
      JOIN volumes_authors ON authors.id = volumes_authors.authors_id
      WHERE volumes_authors.volumes_id = ?`;
    return await pool.query(GET_AUTHORS, [volumesId]);
  }

  //============================== INSERT =======================================//

  // Trouve un auteur par son nom ou le crée s'il n'existe pas
  static async findOrCreateAuthor(name) {
    const FIND_ONE = `SELECT id FROM authors WHERE name = ? LIMIT 1`;
    const [rows] = await pool.execute(FIND_ONE, [name]);

    // Si l'auteur existe déjà, retourne son ID
    if (rows.length > 0) {
      return rows[0].id;
    }

    // Sinon, insère un nouvel auteur et retourne son ID
    const CREATE_AUTHOR = `INSERT INTO authors (name) VALUES (?)`;
    const [result] = await pool.execute(CREATE_AUTHOR, [name]);
    return result.insertId;
  }

  // Associe un auteur à un volume dans la table "volumes_authors"
  static async linkAuthorToVolume(volumeId, authorId) {
    const LINK_AUTHOR = `INSERT INTO volumes_authors (volumes_id, authors_id) VALUES (?, ?)`;
    await pool.execute(LINK_AUTHOR, [volumeId, authorId]);
  }

  //============================== DELETE =======================================//

  // Dissocie un auteur d'un volume (PAS ENCORE UTILISE)
  static async unlinkAuthorFromVolume(volumesId, authorId) {
    const UNLINK_AUTHOR = `
      DELETE FROM volumes_authors
      WHERE volumes_id = ? AND authors_id = ?`;
    await pool.execute(UNLINK_AUTHOR, [volumesId, authorId]);
  }

  // Dissocie tous les auteurs d'un volume
  static async deleteAllAuthorsFromVolume(volumesId) {
    const DELETE_AUTHORS = `DELETE FROM volumes_authors WHERE volumes_id = ?`;
    await pool.execute(DELETE_AUTHORS, [volumesId]);
  }

  //============================== UPDATE =======================================//

  // Dissocie tous les auteurs d'un volume (PAS ENCORE UTILISE)
  static async updateAuthorsForVolume(volumesId, authors) {
    await this.deleteAllAuthorsFromVolume(volumesId);

    for (const author of authors) {
      let authorId;

      if (typeof author === "string") {
        authorId = await this.findOrCreateAuthor(author);
      } else {
        authorId = author;
      }
      await this.linkAuthorToVolume(volumesId, authorId);
    }
  }
}

export default Author;
