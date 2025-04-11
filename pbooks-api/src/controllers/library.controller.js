import pool from "../config/db.js";
import path from "path";
import fs from "fs";

import Volume from "../models/volumes.model.js";
import Work from "../models/works.model.js";
import Media from "../models/medias.model.js";
import Author from "../models/authors.model.js";
import handleUpload from "../config/formidable.js";
import { getPage } from "../utils/getPage.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || "";
  const page = getPage(req);

  try {
    const { datas, count } = await Work.findAll(
      formattedSearch,
      req?.user?.id || "",
      page
    );

    res.json({ datas, totalPages: count });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const [datas] = await Work.findOne(req.params.id);

    if (!datas.length)
      res.status(400).json({ message: "Aucun ouvrage trouvé." });
    res.json({ datas });
  } catch (error) {
    next(error);
  }
};

const getVolumeDetails = async (req, res, next) => {
  try {
    const volumeId = req.params.id;
    const volume = await Volume.findById(volumeId);

    if (!volume)
      res.status(404).json({
        message: "Aucun volume trouvé.",
      });
    res.json({ datas: volume });
  } catch (error) {
    next(error);
  }
};

const getAuthorsBySearch = async (req, res, next) => {
  try {
    const searchTerm = req.query.q ? req.query.q.trim() : "";

    if (!searchTerm)
      res.status(400).json({ message: "Paramètre de recherche requis." });

    const authors = await Author.findByName(searchTerm);
    res.json(authors);
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
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ouvrage :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'ouvrage." });
  }
};

const createVolume = async (req, res, next) => {
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
        await Promise.all(
          parsedAuthors.map(async (authorName) => {
            const authorId = await Author.findOrCreateAuthor(authorName);
            await Author.linkAuthorToVolume(volumesId, authorId);
          })
        );
      }

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
  const formOptions = {
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/medias"),
    maxFileSize: 5 * 1024 * 1024,
  };

  handleUpload(
    req,
    res,
    async () => {
      const volumesId = req.body?.volumesId?.[0];
      if (!req.files || !req.files.media) {
        return res.status(400).json({ message: "Fichier média manquant." });
      }
      console.log(req.query);
      const mediaFile = Array.isArray(req.files.media)
        ? req.files.media[0]
        : req.files.media;
      console.log("Fichier média : ", mediaFile);
      if (!mediaFile) {
        return res.status(400).json({ message: "Fichier média introuvable." });
      }

      const fileExt = path
        .extname(mediaFile.originalFilename || "")
        .toLowerCase();
      const validExtensions = ["jpg", "jpeg", "png", "webp"];
      if (!validExtensions.includes(fileExt.replace(".", ""))) {
        return res
          .status(400)
          .json({ message: "Extension de fichier invalide." });
      }

      const newFilename = `media_${Date.now()}${fileExt}`;
      const outputFilePath = path.join(
        process.cwd(),
        "public/uploads/medias",
        newFilename
      );

      try {
        fs.renameSync(mediaFile.filepath, outputFilePath);
        const existingMedia = await Media.findByVolumeId(volumesId);
        if (existingMedia) {
          const oldMediaPath = path.join(
            process.cwd(),
            "public/uploads/medias",
            existingMedia.url
          );

          try {
            if (fs.unlink(oldMediaPath)) {
              fs.unlinkSync(oldMediaPath);
              console.log(`Ancien fichier supprimé : ${existingMedia.url}`);
            }
          } catch (unlinkError) {
            console.error(
              "Erreur lors de la suppression de l'ancien média :",
              unlinkError
            );
          }

          const queryResult = await Media.updateMedia({
            url: newFilename,
            volumes_id: volumesId,
          });
          const [result] = queryResult;
          if (!result || result.affectedRows === 0) {
            return res.status(500).json({
              message: "Erreur lors de l'ajout / mise à jour du média.",
            });
          }
          return res.json({
            message: "Média mis à jour avec succès.",
            mediaUrl: newFilename,
          });
        }

        const queryResult = await Media.insertMedia({
          url: newFilename,
          volumes_id: volumesId,
        });
        const [result] = queryResult;
        if (!result || result.affectedRows === 0) {
          return res.status(500).json({
            message: "Erreur lors de l'ajout / mise à jour du média.",
          });
        }
        return res.json({
          message: "Média ajouté avec succès.",
          mediaUrl: newFilename,
        });
      } catch (error) {
        console.error("Erreur lors du déplacement du fichier média :", error);
        return res.status(500).json({
          message: "Erreur lors du traitement du fichier.",
          error: error.message,
        });
      }
    },
    formOptions
  );
};

//============================== PATCH =======================================//

const updateWork = async (req, res, next) => {
  try {
    const workId = req.params.id;
    if (!workId) {
      return res.status(400).json({ message: "ID d'ouvrage manquant." });
    }

    const updateFields = {};
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.edition !== undefined) updateFields.edition = req.body.edition;
    if (req.body.type !== undefined) updateFields.type = req.body.type;
    if (req.body.format !== undefined) updateFields.format = req.body.format;

    const result = await Work.updateWork({
      worksId: workId,
      ...updateFields,
    });

    if (result && result.affectedRows > 0) {
      return res.json({ message: "Ouvrage mis à jour avec succès." });
    } else {
      return res
        .status(400)
        .json({ message: "Aucune modification effectuée." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: error.message });
  }
};

const updateVolume = async (req, res, next) => {
  try {
    const volumeId = req.params.id;
    if (!volumeId) {
      return res.status(400).json({ message: "ID de volume manquant." });
    }

    const updateFields = {};

    if (req.body.number !== undefined) updateFields.number = req.body.number;
    if (req.body.title !== undefined) updateFields.title = req.body.title;
    if (req.body.isbn !== undefined) updateFields.isbn = req.body.isbn;
    if (req.body.summary !== undefined) updateFields.summary = req.body.summary;
    if (req.body.creator_visibility !== undefined)
      updateFields.creator_visibility = req.body.creator_visibility;

    const result = await Volume.updateVolume({
      volumesId: volumeId,
      ...updateFields,
    });

    const authors = req.body.authors || [];
    await Author.deleteAllAuthorsFromVolume(volumeId);
    for (const author of authors) {
      const authorId = await Author.findOrCreateAuthor(author);
      await Author.linkAuthorToVolume(volumeId, authorId);
    }

    if (result && result.affectedRows > 0) {
      return res.json({ message: "Volume mis à jour avec succès." });
    } else {
      return res
        .status(400)
        .json({ message: "Aucune modification effectuée." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: error.message });
  }
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
  getVolumeDetails,
  getAuthorsBySearch,
  createWork,
  createVolume,
  updateWork,
  updateVolume,
  updateStatus,
  removeWork,
  removeVolume,
  uploadMedia,
};
