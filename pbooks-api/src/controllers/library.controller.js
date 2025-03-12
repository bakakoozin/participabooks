import pool from "../config/db.js";
import formidable from "formidable";

import Volume from "../models/volumes.model.js";
import Work from "../models/works.model.js";
import Media from "../models/medias.model.js";
import Author from "../models/authors.model.js";
import Review from "../models/reviews.model.js";
import sendResponse from "../helpers/sendResponse.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  try {
    const [response] = await Work.findAll();

    if (response.length) {
      sendResponse(res, "Ouvrages récupérés.", 200, response);
      return;
    }
    sendResponse(res, "Aucun ouvrage récupéré.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

const getBySearch = async (req, res, next) => {
  try {
    const formattedSearch = req.query.q?.trim() || "";
    if (!formattedSearch) {
      return sendResponse(res, "Paramètre de recherche requis.", 400);
    }

    const [response] = await Work.findBySearch(formattedSearch);

    if (response.length > 0) {
      return sendResponse(res, "Ouvrage trouvé.", 200, response);
    }

    return sendResponse(res, "Aucun ouvrage trouvé.", 404);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const [response] = await Work.findOne(req.params.id);

    if (response.length) {
      sendResponse(res, "Ouvrage récupéré.", 200, response);
      return;
    }
    sendResponse(res, "Aucun ouvrage récupéré.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

const getAuthorsBySearch = async (req, res, next) => {
  try {
    const searchTerm = req.query.q ? req.query.q.trim() : "";
    if (!searchTerm) {
      return res
        .status(400)
        .json({ message: "Paramètre de recherche requis." });
    }
    const authors = await Author.findByName(searchTerm);
    res.json(authors);
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const [response] = await Review.findByVolumes(req.params.id);

    if (response.length) {
      sendResponse(res, "Avis récupérés.", 200, response);
      return;
    }
    sendResponse(res, "Aucun avis récupéré.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

//============================== POST =======================================//

const create = async (req, res, next) => {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    console.log(fields); // Vérifie le contenu des champs envoyés
console.log(files);
    if (err) {
      return res
        .status(400)
        .json({ error: "Erreur lors du téléchargement du fichier." });
    }

    const {
      name,
      edition,
      type,
      format,
      number,
      title,
      isbn,
      summary,
      creator_visibility,
      users_id,
      authors,
    } = fields;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const worksId = await Work.findOrCreateWork({
        name,
        edition,
        type,
        format,
      });

      const volumesId = await Volume.insertVolume({
        worksId,
        number,
        title,
        isbn,
        summary,
        creator_visibility,
        users_id,
      });

      const parseAuthors = authors ? JSON.parse(authors) : [];

      if (Array.isArray(parseAuthors) && parseAuthors.length > 0) {
        await Promise.all(
          parseAuthors.map(async (authorName) => {
            const authorId = await Author.findOrCreateAuthor(authorName);
            await Author.linkAuthorToVolume(volumesId, authorId);
          })
        );
      }

      const file = files.media;
      if (file) {
        const url = `/uploads/medias/${file.newFilename}`;

        await Media.insertMedia({ volumes_id: volumesId, url });
      }
      await connection.commit();
      res.status(201).json({
        message: "Ouvrage et volume ajoutés avec succès.",
        worksId,
        volumesId,
      });
    } catch (error) {
      console.error("Erreur interne du serveur : ", error);
      await connection.rollback();
      res
        .status(500)
        .json({ error: "Erreur lors de l'ajout.", details: error.message });
    } finally {
      connection.release();
    }
  });
};

//============================== PATCH =======================================//

const update = async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Erreur lors du téléchargement du fichier." });
    }

    const { worksId, volumesId, authors } = fields;

    if (!worksId) {
      return res
        .status(400)
        .json({ error: "ID de l'ouvrage obligatoire pour la mise à jour." });
    }

    if (!volumesId) {
      return res
        .status(400)
        .json({ error: "ID du volume obligatoire pour la mise à jour." });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // construction de l'objet de mise à jour pour le work
      const workFields = {};
      ["name", "edition", "type", "format"].forEach((key) => {
        if (fields[key] !== undefined && fields[key] !== "") {
          workFields[key] = fields[key];
        }
      });

      // mise à jour seulement s'il y a des champs à modifier
      if (Object.keys(workFields).length > 0) {
        await Work.updateWork({ worksId, ...workFields });
      }

      // construction de l'objet de mise à jour pour le volume
      const volumeFields = {};
      ["number", "title", "isbn", "summary", "creator_visibility"].forEach(
        (key) => {
          if (fields[key] !== undefined && fields[key] !== "") {
            volumeFields[key] = fields[key];
          }
        }
      );
      // gestion du toggle creator_visibility (tinyint 0/1)
      if (fields.creator_visibility !== undefined) {
        volumeFields.creator_visibility = parseInt(
          fields.creator_visibility,
          10
        );
      }

      // mise à jour seulement s'il y a des champs à modifier
      if (Object.keys(volumeFields).length > 0) {
        await Volume.updateVolume({ volumesId, ...volumeFields });
      }

      if (authors) {
        const parseAuthors =
          typeof authors === "string" ? JSON.parse(authors) : authors;

        if (Array.isArray(parseAuthors) && parseAuthors.length > 0) {
          const existingAuthors = await Author.getAuthorsByVolumeId(volumesId);

          await Promise.all(
            parseAuthors.map(async (authorName) => {
              const authorId = await Author.findOrCreateAuthor(authorName);

              if (!existingAuthors.some((author) => author.id === authorId)) {
                await Author.linkAuthorToVolume(volumesId, authorId);
              }
            })
          );

          await Promise.all(
            existingAuthors.map(async (existingAuthor) => {
              if (!parseAuthors.includes(existingAuthor.name)) {
                await Author.unlinkAuthorFromVolume(
                  volumesId,
                  existingAuthor.id
                );
              }
            })
          );
        }
      }

      const file = files.media;
      const url = file ? `/uploads/medias/${file.newFilename}` : null;

      if (file) {
        await Media.updateMedia({ volumesId, url });
      }

      await connection.commit();
      res.json({
        message: "Mise à jour effectuée avec succès.",
        worksId,
        volumesId,
        mediaUrl: url,
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        error: "Erreur lors de la mise à jour.",
        details: error.message,
      });
    } finally {
      connection.release();
    }
  });
};

const updateStatus = async (req, res, next) => {
  try {
    const [response] = await Volume.updateStatus(
      req.body.status,
      req.params.id
    );
    if (response.affectedRows) {
      res.status(201).json({ message: "Status du volume mis à jour." });
      return;
    }
    res
      .status(400)
      .json({ message: "un problème est survenu, veuillez réessayer." });
    return;
  } catch (error) {
    next(error);
  }
};

//============================== DELETE =======================================//

const removeWork = async (req, res, next) => {
  try {
    const [response] = await Work.deleteWork(req.params.id);
    if (response.affectedRows) {
      res.json({ message: "Ouvrage supprimé." });
      return;
    }
    res.status(400).json({ message: "Cet ouvrage n'existe pas." });
    return;
  } catch (error) {
    next(error);
  }
};

const removeVolume = async (req, res, next) => {
  try {
    const [response] = await Volume.deleteVolume(req.params.id);
    if (response.affectedRows) {
      res.json({ message: "Volume supprimé." });
      return;
    }
    res.status(400).json({ message: "Ce volume n'existe pas." });
    return;
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  getBySearch,
  getOne,
  getAuthorsBySearch,
  getReviews,
  create,
  update,
  updateStatus,
  removeWork,
  removeVolume,
};
