import handleUpload from "../config/formidable.js";
import pool from "../config/db.js";
import path from "path";
import fs from "fs";

import { getPage } from "../utils/getPage.js";

import Volume from "../models/volumes.model.js";
import Author from "../models/authors.model.js";
import Media from "../models/medias.model.js";
import Work from "../models/works.model.js";

//============================== GET =======================================//

// Récupérer tous les ouvrages
const getAll = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || ""; // Recherche formatée
  const page = getPage(req); // Récupère la page actuelle
  const limit = parseInt(req.query.limit, 10) || 10; // Limite par page (par défaut : 10)

  try {
    // Récupère les ouvrages et le nombre total d'ouvrages
    console.log("formattedSearch", formattedSearch);
    const { datas, count } = await Work.findAll(
      formattedSearch,
      req?.user?.id || "", // ID de l'utilisateur connecté (si disponible)
      req?.user?.role || "", 
      page,
      limit
    );

    // Retourne les ouvrages et le nombre total de pages
    res.json({ datas, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    next(error); // Passe l'erreur au middleware d'erreur
  }
};

// Récupérer un ouvrage par son ID
const getOne = async (req, res, next) => {
  try {
    const [datas] = await Work.findOne(req.params.id); // Recherche l'ouvrage par ID

    if (!datas.length)
      res.status(400).json({ message: "Aucun ouvrage trouvé." }); // Aucun ouvrage trouvé
    res.json({ datas }); // Retourne les données de l'ouvrage
  } catch (error) {
    next(error);
  }
};

// Récupérer les détails d'un volume par son ID
const getVolumeDetails = async (req, res, next) => {
  try {
    const volumeId = req.params.id;
    const volume = await Volume.findById(volumeId); // Recherche le volume par ID

    if (!volume)
      res.status(404).json({
        message: "Aucun volume trouvé.",
      }); // Aucun volume trouvé
    res.json({ datas: volume }); // Retourne les détails du volume
  } catch (error) {
    next(error);
  }
};

//============================== POST =======================================//

// Créer un nouvel ouvrage
const createWork = async (req, res, next) => {
  try {
    const { name, edition, type, format } = req.body;
    if (!name || !type || !format) {
      return res
        .status(400)
        .json({ error: "Les champs obligatoires sont manquants." }); // Vérifie les champs obligatoires
    }
    
    // Ajoute ou récupère l'ID de l'ouvrage
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

// Créer un nouveau volume
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
    const users_id = req.user.id; // ID de l'utilisateur connecté
    const volumeData = {
      worksId,
      number: number || null,
      title: title || null,
      isbn,
      summary: summary || null,
      creator_visibility,
      users_id,
    };

    const connection = await pool.getConnection(); // Connexion à la base de données
    try {
      await connection.beginTransaction(); // Démarre une transaction

      const existingVolume = await Volume.isbnExist(isbn); // Vérifie si l'ISBN existe déjà

      if (existingVolume) {
        return res
          .status(400)
          .json({ error: `Le volume avec l'ISBN ${isbn} existe déjà.` });
      }
      // Insère le volume dans la base de données
      const volumesId = await Volume.insertVolume(volumeData);
      const parsedAuthors = authors ? JSON.parse(authors) : [];

      // Ajoute les auteurs au volume
      if (Array.isArray(parsedAuthors) && parsedAuthors.length > 0) {
        await Promise.all(
          parsedAuthors.map(async (authorName) => {
            const authorId = await Author.findOrCreateAuthor(authorName);
            await Author.linkAuthorToVolume(volumesId, authorId);
          })
        );
      }

      await connection.commit(); // Valide la transaction
      res.status(201).json({
        message: "Volume ajoutés avec succès.",
        worksId,
        volumesId,
      });
    } catch (error) {
      console.error("Erreur interne du serveur :", error);

      await connection.rollback(); // Annule la transaction en cas d'erreur
      res.status(500).json({
        error: "Erreur lors de l'ajout du volume.",
        details: error.message,
      });
    } finally {
      connection.release(); // Libère la connexion
    }
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
    res.status(500).json({
      error: "Erreur lors de la connexion à la base de données.",
      details: error.message,
    });
  }
};

// Uploader un média
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
      const mediaFile = Array.isArray(req.files.media)
        ? req.files.media[0]
        : req.files.media;
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

// Mettre à jour un ouvrage
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

// Mettre à jour un volume
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

// Mettre à jour le statut d'un volume
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

// Supprimer un ouvrage
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

// Supprimer un volume
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
  createWork,
  createVolume,
  uploadMedia,
  updateWork,
  updateVolume,
  updateStatus,
  removeWork,
  removeVolume,
};
