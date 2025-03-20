import pool from "../config/db.js";
import path from "path";
import fs from "fs";

import Volume from "../models/volumes.model.js";
import Work from "../models/works.model.js";
import Media from "../models/medias.model.js";
import Author from "../models/authors.model.js";
import Review from "../models/reviews.model.js";
import sendResponse from "../helpers/sendResponse.js";
import handleUpload from "../config/formidable.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || "";
  try {
    const [response] = await Work.findAll(formattedSearch);
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

const createWork = async (req, res, next) => {
  try {
    const { name, edition, type, format } = req.body;
    if (!name || !type || !format) {
      return res
        .status(400)
        .json({ error: "Les champs obligatoires sont manquants." });
    }

    const worksId = await Work.findOrCreateWork({
      name,
      edition,
      type,
      format,
    });

    res.status(201).json({ worksId: worksId, message: "Ouvrage ajouté." });
    console.log("Ouvrage ajouté :", worksId);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ouvrage :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'ouvrage." });
  }
};

const editWork = async (req, res, next) => {
  try {
    const {
      works_id,
      number,
      title,
      isbn,
      summary,
      creator_visibility,
      authors,
    } = req.body;

    if (!works_id) {
      return res.status(400).json({ error: "ID de l'ouvrage manquant." });
    }

    const worksId = works_id;
    const users_id = req.user.id;
    const volumeData = {
      worksId,
      number: number || null,
      title: title || null,
      isbn,
      summary: summary || null,
      creator_visibility,
      users_id,
    };

    // Connexion à la base de données
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existingVolume] = await connection.query(
        "SELECT * FROM volumes WHERE isbn = ?",
        [isbn]
      );

      if (existingVolume.length > 0) {
        return res
          .status(400)
          .json({ error: `Le volume avec l'ISBN ${isbn} existe déjà.` });
      }
      const volumesId = await Volume.insertVolume(volumeData);
      const parsedAuthors = authors ? JSON.parse(authors) : [];

      if (Array.isArray(parsedAuthors) && parsedAuthors.length > 0) {
        console.log("Ajout des auteurs :", parsedAuthors);
        await Promise.all(
          parsedAuthors.map(async (authorName) => {
            const authorId = await Author.findOrCreateAuthor(authorName);
            await Author.linkAuthorToVolume(volumesId, authorId);
            console.log(`Auteur "${authorName}" lié au volume ${volumesId}`);
          })
        );
      } else {
        console.log("Aucun auteur à ajouter.");
      }

      // Validation de la transaction
      await connection.commit();
      res.status(201).json({
        message: "Volume ajoutés avec succès.",
        worksId,
        volumesId,
      });
    } catch (error) {
      console.error("Erreur interne du serveur :", error);

      await connection.rollback();
      res.status(500).json({
        error: "Erreur lors de l'ajout du volume.",
        details: error.message,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    res.status(500).json({
      error: "Erreur lors de la connexion à la base de données.",
      details: error.message,
    });
  }
};

const uploadMedia = async (req, res, next) => {
  console.log("Début de l'upload du média...");

  const volumesId = req.body?.volumesId;
  if (!volumesId) {
    return res.status(400).json({ message: "ID du volume obligatoire." });
  }

  const formOptions = {
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/medias"),
    maxFileSize: 5 * 1024 * 1024,
  };
  console.log(req.body);  // Affichez ce qui est reçu
  console.log(req.file);

  handleUpload(req, res, async () => {
    console.log("Fichier téléchargé :", req.files);
    console.log("Body reçu :", req.body);

    if (!req.files || !req.files.media) {
      return res.status(400).json({ message: "Fichier média manquant." });
    }

    const mediaFile = req.files.media[0];
    const fileExt = path.extname(originalFilename).toLowerCase();
    const validExtensions = ["jpg", "jpeg", "png", "webp"];

    if (!validExtensions.includes(fileExt)) {
      fs.unlink(mediaFile.path, () => { });
      return res
        .status(400)
        .json({ message: `Format non autorisé: ${fileExt}` });
    }

    const newFilename = `media_${Date.now()}${fileExt}`;
    const outputFilePath = path.join(
      process.cwd(),
      "public/uploads/medias",
      newFilename
    );

    try {
      fs.renameSync(mediaFile.filepath, outputFilePath);

      const [existingMedia] = await Media.findByVolumeId(volumesId);
      const oldMedia = existingMedia[0]?.url;

      if (oldMedia) {
        // Si un média existe déjà, on le remplace et on supprime l'ancien fichier
        const oldMediaPath = path.join(process.cwd(), "public/uploads/medias", oldMedia);
        fs.access(oldMediaPath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldMediaPath, (unlinkErr) => {
              if (unlinkErr) {
                console.error("Erreur lors de la suppression de l'ancien media :", unlinkErr);
              } else {
                console.log("Ancien media supprimé :", oldMedia);
              }
            });
          }
        });
      }
      const result = await Media.updateMedia(newFilename, volumesId);
      if (!result) {
        return res.status(500).json({ message: "Erreur lors de l'ajout du média." });
      }

      return res.json({
        message: "Média ajouté avec succès.",
        mediaUrl: newFilename,
      });
    } catch (error) {
      console.error("Erreur lors du déplacement du fichier média :", error);
      return res
        .status(500)
        .json({
          message: "Erreur lors du traitement du fichier.",
          error: error.message,
        });
    }
  }, formOptions);
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
  getOne,
  getAuthorsBySearch,
  getReviews,
  createWork,
  editWork,
  update,
  updateStatus,
  removeWork,
  removeVolume,
  uploadMedia,
};
