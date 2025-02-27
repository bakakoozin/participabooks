import { Router } from "express";
import {
  getInfos,
  update,
  remove,
  uploadAvatar,
} from "../controllers/user.controller.js";
import {
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
} from "../controllers/shelf.controller.js";

const router = Router();

router.get("/", getInfos);

//PROFILE
router.patch("/profile", update);
router.delete("/profile", remove);
router.patch("/profile/avatar", uploadAvatar);

//SHELF
router.get("/shelf", getAllUserWorks);
router.get("/shelf/search", getBySearchOnShelf);
router.post("/shelf/volume", addVolumeToShelf);
router.patch("/shelf/volume/status", updateStatusOnShelf);
router.delete("/shelf/volume/:id", removeVolumeFromShelf);
router.post("/shelf/work", addAllVolumesToShelf);
router.get("/shelf/work/:id", getOneUserWork);
router.delete("/shelf/work/:id", removeWorkFromShelf);

//REVIEWS
router.post("shelf/volumes/:id/reviews", addReview);
router.patch("shelf/volumes/:id/reviews/comment", updateComment);
router.patch("shelf/volumes/:id/reviews/score", updateScore);
router.delete("shelf/volumes/:id/reviews/:id", removeReview);

export default router;
