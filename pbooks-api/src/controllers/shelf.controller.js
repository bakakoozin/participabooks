import Shelf from "../models/shelfs.model.js";
import Volume from "../models/volumes.model.js";
import pool from "../config/db.js";
import { getPage } from "../utils/getPage.js";

//============================== GET =======================================//

const getAllUserWorks = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || "";
  const page = getPage(req);

  try {
    const {datas, count} = await Shelf.findAll(formattedSearch, req?.user?.id || "", page);

    res.json({ datas, totalPages: count });
  } catch (error) {
    next(error);
  }
};

const getOneUserWork = async (req, res, next) => {
  try {
    const [datas] = await Shelf.findOne({
      users_id: req.user.id,
      works_id: req.params.id,
    });

    if (!datas.length)
      res.status(400).json({ message: "Aucun ouvrage trouvé." });
    res.json({ datas });
  } catch (error) {
    next(error);
  }
};

//============================== POST =======================================//

const addVolumeToShelf = async (req, res, next) => {
  const { users_id, volumes_id } = req.body;

  try {
    await Shelf.insertVolume({ users_id, volumes_id });
    res
      .status(201)
      .json({ message: "Volume ajouté à la bibliothèque personnelle." });
  } catch (error) {
    next(error);
  }
};

const addAllVolumesToShelf = async (req, res, next) => {
  const { users_id, works_id } = req.body;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const volumesIds = await Volume.findAllByWorkId(works_id);
    if (volumesIds.length === 0)
      return res.status(400).json({ message: "Aucun volume trouvé." });

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
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

//============================== PATCH =======================================//

const updateStatusOnShelf = async (req, res, next) => {
  try {
    const { status } = req.body;
    const volumes_id = req.params.id;
    const users_id = req.user.id;

    const [response] = await Volume.updateStatus({
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

const removeVolumeFromShelf = async (req, res, next) => {
  try {
    const [response] = await Shelf.deleteVolume(req.params.id, req.user.id);

    if (!response.affectedRows)
      return res.status(400).json({ message: "Ce volume n'existe pas." });
    res.json({ message: "Volume retiré de la bibliothèque personnelle." });
  } catch (error) {
    next(error);
  }
};

const removeWorkFromShelf = async (req, res, next) => {
  try {
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
