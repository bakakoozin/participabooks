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
      SELECT authors.id, authors.name
      FROM authors
      JOIN volumes_authors ON authors.id = volumes_authors.authors_id
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

  static async linkAuthorToVolume(volumeId, authorId) {
    const LINK_AUTHOR = `INSERT INTO volumes_authors (volumes_id, authors_id) VALUES (?, ?)`;
    await pool.execute(LINK_AUTHOR, [volumeId, authorId]);
  }

  //============================== DELETE =======================================//

  static async unlinkAuthorFromVolume(volumesId, authorId) {
    const UNLINK_AUTHOR = `
      DELETE FROM volumes_authors
      WHERE volumes_id = ? AND authors_id = ?`;
    await pool.execute(UNLINK_AUTHOR, [volumesId, authorId]);
  }

  static async deleteAllAuthorsFromVolume(volumesId) {
    const DELETE_AUTHORS = `DELETE FROM volumes_authors WHERE volumes_id = ?`;
    await pool.execute(DELETE_AUTHORS, [volumesId]);
  }

  //============================== UPDATE =======================================//

  static async updateAuthorsForVolume(volumesId, authors) {
    // Supprimer tous les auteurs liés au volume
    await this.deleteAllAuthorsFromVolume(volumesId);

    // Ajouter les nouveaux auteurs
    for (const author of authors) {
      let authorId;
      
      // Si c'est un nouvel auteur, on le crée
      if (typeof author === "string") {
        authorId = await this.findOrCreateAuthor(author);
      } else {
        authorId = author; // Sinon, c'est un ID existant
      }

      // Lier l'auteur au volume
      await this.linkAuthorToVolume(volumesId, authorId);
    }
  }
}

export default Author;
