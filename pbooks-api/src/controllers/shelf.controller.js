import Shelf from "../models/shelfs.model.js";
import Volume from "../models/volumes.model.js";
import Review from "../models/reviews.model.js";
import sendResponse from "../helpers/sendResponse.js";

//============================== GET =======================================//

const getAllUserWorks = async (req, res, next) => {
  const users_id = req.user.id;
  try {
    const [response] = await Shelf.findAll(users_id);
    if (response.length) {
      sendResponse(
        res,
        "Ouvrages récupérés pour l'utilisateur.",
        200,
        response
      );
      return;
    }
    sendResponse(res, "Aucun ouvrage récupéré pour l'utilisateur.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

const getOneUserWork = async (req, res, next) => {
    const users_id = req.user.id;
    const works_id = req.params.id;
    try {
      const [response] = await Shelf.findOne({users_id, works_id});
      console.log('Réponse de la base de données:', response);
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

  const getBySearchOnShelf = async (req, res, next) => {
    const users_id = req.user.id;
    console.log('users_id:', users_id);
    const formattedSearch = req.query.q ? req.query.q.trim() : null;
    console.log('formattedSearch:', formattedSearch);
    try {
      const [response] = await Shelf.findBySearch({users_id, formattedSearch});
      console.log('Réponse de la base de données:', response);
  
      if (response.length) {
        sendResponse(res, "Ouvrage trouvé.", 200, response);
        return;
      }
      sendResponse(res, "Aucun ouvrage trouvé.", 400);
      return;
    } catch (error) {
      next(error);
    }
  };

//============================== POST =======================================//

const addVolumeToShelf = async (req, res, next) => {
  const { users_id, volumes_id } = req.body;
  try {
    await Shelf.insertVolume({ users_id, volumes_id });
    sendResponse(res, "Volume ajouté à la bibliothèque personnelle.", 201);
  } catch (error) {
    next(error);
  }
};

const addAllVolumesToShelf = async (req, res, next) => {
  const { users_id, works_id } = req.body;
  try {
    const volumes = await Volume.findAllByWorkId(works_id);
    if (volumes.length === 0) {
      sendResponse(res, "Aucun volume trouvé pour cet ouvrage.", 400);
      return;
    }
    await Promise.all(
      volumes.map((volume) =>
        Shelf.insertVolume({ users_id, volumes_id: volume.id })
      )
    );
    sendResponse(
      res,
      "Tous les volumes de l'ouvrage ont été ajoutés à la bibliothèque personnelle.",
      201
    );
  } catch (error) {
    next(error);
  }
};

const addReview = async (req, res, next) => {
  const { score, comment, users_id, volumes_id } = req.body;

  try {
    const [response] = await Review.addReview({
      score,
      comment,
      users_id,
      volumes_id,
    });

    if (response.affectedRows) {
      res.json({ message: "Avis ajouté." });
      return;
    }
    res.status(400).json({ message: "Erreur lors de l'ajout de l'avis." });
  } catch (error) {
    next(error);
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

const updateScore = async (req, res, next) => {
  try {
    const [response] = await Review.updateScore( req.body.score, req.params.id );
    if (response.affectedRows) {
      res.json({ message: "Note mise à jour."});
    }
    res.status(400).json({ message: "Erreur lors de la mise à jour de la note." });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const [response] = await Review.updateComment( req.body.comment, req.params.id );
    if (response.affectedRows) {
      res.json({ message: "Commentaire mis à jour."});
    }
    res.status(400).json({ message: "Erreur lors de la mise à jour du commentaire." });
  } catch (error) {
    next(error);
  }
};

//============================== DELETE =======================================//

const removeVolumeFromShelf = async (req, res, next) => {
  try {
    const [response] = await Shelf.deleteVolume(req.params.id);
    if (response.affectedRows) {
      sendResponse(res, "Volume retiré de la bibliothèque personnelle.", 200);
      return;
    }
    sendResponse(res, "Ce volume n'existe pas.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

const removeWorkFromShelf = async (req, res, next) => {
  try {
    const [response] = await Shelf.deleteAllVolumes(req.params.id);
    if (response.affectedRows) {
      sendResponse(res, "Ouvrage retiré de la bibliothèque personnelle.", 200);
      return;
    }
    sendResponse(res, "Cet ouvrage n'existe pas.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

const removeReview = async (req, res, next) => {
  try {
    const [response] = await Review.deleteReview(req.params.id);
    if (response.affectedRows) {
      res.json({ message: "Avis supprimé." });
      return;
    }
    res.status(400).json({ message: "Cet avis n'existe pas." });
    return;
  } catch (error) {
    next(error);
  }
};


export {
  getAllUserWorks,
  getOneUserWork,
  getBySearchOnShelf,
  addVolumeToShelf,
  addAllVolumesToShelf,
  addReview,
  updateStatusOnShelf,
  updateComment,
  updateScore,
  removeVolumeFromShelf,
  removeWorkFromShelf,
  removeReview,
};
