import Shelf from "../models/shelfs.model.js";
import Volume from "../models/volumes.model.js";
import pool from "../config/db.js";
import { getPage } from "../utils/getPage.js";

//============================== GET =======================================//

// Récupére tous les ouvrages de la bibliothèque personnelle d'un utilisateur
const getAllUserWorks = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || ""; // Recherche formatée
  const page = getPage(req); // Récupère la page actuelle
  const limit = parseInt(req.query.limit, 10) || 10; // Limite par page (par défaut : 10)

  try {
    // Récupère les ouvrages et le nombre total d'ouvrages
    const { datas, count } = await Shelf.findAll(
      formattedSearch,
      req?.user?.id || "", // ID de l'utilisateur connecté
      page
    );

    // Retourne les ouvrages et le nombre total de pages
    res.json({ datas, totalPages: Math.ceil(count/limit) });
  } catch (error) {
    next(error); // Passe l'erreur au middleware d'erreur
  }
};

// Récupére un ouvrage de la bibliothèque personnelle d'un utilisateur
const getOneUserWork = async (req, res, next) => {
  try {
    const [datas] = await Shelf.findOne({
      users_id: req.user.id, // ID de l'utilisateur connecté
      works_id: req.params.id, // ID de l'ouvrage
    });

    if (!datas.length)
      res.status(400).json({ message: "Aucun ouvrage trouvé." }); // Aucun ouvrage trouvé
    res.json({ datas }); // Retourne les données de l'ouvrage
  } catch (error) {
    next(error);
  }
};

//============================== POST =======================================//

// Ajoute un volume à la bibliothèque personnelle d'un utilisateur
const addVolumeToShelf = async (req, res, next) => {
  const { users_id, volumes_id } = req.body; // Récupère l'ID de l'utilisateur et du volume

  try {
    // Insère le volume dans la bibliothèque personnelle
    await Shelf.insertVolume({ users_id, volumes_id });
    res
      .status(201)
      .json({ message: "Volume ajouté à la bibliothèque personnelle." });
  } catch (error) {
    next(error);
  }
};

// Ajoute tous les volumes d'un ouvrage à la bibliothèque personnelle d'un utilisateur
const addAllVolumesToShelf = async (req, res, next) => {
  const { users_id, works_id } = req.body; // Récupère l'ID de l'utilisateur et de l'ouvrage
  const connection = await pool.getConnection(); // Connexion à la base de données
  await connection.beginTransaction(); // Démarre une transaction
  try {
    // Récupère tous les volumes associés à l'ouvrage
    const volumesIds = await Volume.findAllByWorkId(works_id);
    if (volumesIds.length === 0)
      return res.status(400).json({ message: "Aucun volume trouvé." });

    // Ajoute chaque volume à la bibliothèque personnelle
    await Promise.all(
      volumesIds.map((volume_id) => {
        return Shelf.insertVolume(
          { volumes_id: volume_id, users_id },
          connection
        );
      })
    );

    res.status(201).json({
      message:
        "Tous les volumes de l'ouvrage ont été ajoutés à la bibliothèque personnelle.",
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
    await connection.rollback(); // Annule la transaction en cas d'erreur
    next(error);
  } finally {
    connection.release(); // Libère la connexion
  }
};

//============================== PATCH =======================================//

// Met à jour le statut d'un volume dans la bibliothèque personnelle d'un utilisateur
const updateStatusOnShelf = async (req, res, next) => {
  try {
    const { status } = req.body; // Nouveau statut
    const volumes_id = req.params.id; // ID du volume
    const users_id = req.user.id; // ID de l'utilisateur connecté

    // Met à jour le statut du volume
    const [response] = await Shelf.updateStatus({
      status,
      volumes_id,
      users_id,
    });

    if (!response.affectedRows)
      res.status(400).json({ message: "Problème lors de la mise à jour." });
    res.status(201).json({ message: "Statut mis à jour." });
  } catch (error) {
    next(error);
  }
};

//============================== DELETE =======================================//

// Supprime un volume de la bibliothèque personnelle d'un utilisateur
const removeVolumeFromShelf = async (req, res, next) => {
  try {
    // Supprime le volume en fonction de l'ID du volume et de l'utilisateur
    const [response] = await Shelf.deleteVolume(req.params.id, req.user.id);

    if (!response.affectedRows)
      return res.status(400).json({ message: "Ce volume n'existe pas." });
    res.json({ message: "Volume retiré de la bibliothèque personnelle." });
  } catch (error) {
    next(error);
  }
};

// Supprime un ouvrage de la bibliothèque personnelle d'un utilisateur
const removeWorkFromShelf = async (req, res, next) => {
  try {
    // Supprime tous les volumes associés à l'ouvrage
    const [response] = await Shelf.deleteAllVolumes(req.params.id, req.user.id);

    if (!response.affectedRows)
      return res.status(400).json({ message: "Cet ouvrage n'existe pas." });
    res.json({ message: "Ouvrage retiré de la bibliothèque personnelle." });
  } catch (error) {
    next(error);
  }
};

export {
  getAllUserWorks,
  getOneUserWork,
  addVolumeToShelf,
  addAllVolumesToShelf,
  updateStatusOnShelf,
  removeVolumeFromShelf,
  removeWorkFromShelf,
};
