import Shelf from "../models/shelfs.model.js";
import Volume from "../models/volumes.model.js";
import pool from "../config/db.js";

//============================== GET =======================================//

const getAllUserWorks = async (req, res, next) => {
  const formattedSearch = req.query.q?.trim() || "";

  try {
    const [datas] = await Shelf.findAll(req.user.id, formattedSearch);

    if (!datas.length)
      res.status(400).json({ message: "Aucun ouvrage trouvé." });

    res.json({
      datas,
    });
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

    if (!datas.length) res.status(400).json({ message: "Aucun ouvrage trouvé." });
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
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

//============================== PATCH =======================================//

const updateStatusOnShelf = async (req, res, next) => {
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
