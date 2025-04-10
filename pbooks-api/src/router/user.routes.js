import { Router } from "express";

import {
  getInfos,
  update,
  remove,
  uploadAvatar,
  updateTheme,
} from "../controllers/user.controller.js";
import {
  getAllUserWorks,
  getOneUserWork,
  addVolumeToShelf,
  addAllVolumesToShelf,
  updateStatusOnShelf,
  removeVolumeFromShelf,
  removeWorkFromShelf,
} from "../controllers/shelf.controller.js";

const router = Router();

router.get("/", getInfos);

//PROFILE
router.patch("/profile", update);
router.delete("/profile", remove);
router.patch("/profile/avatar", uploadAvatar);
router.patch("/profile/theme", updateTheme);

//SHELF
router.get("/shelf", getAllUserWorks);
router.post("/shelf/volume", addVolumeToShelf);
router.patch("/shelf/volume/:id/status", updateStatusOnShelf);
router.delete("/shelf/volume/:id", removeVolumeFromShelf);
router.post("/shelf/work", addAllVolumesToShelf);
router.get("/shelf/work/:id", getOneUserWork);
router.delete("/shelf/work/:id", removeWorkFromShelf);

export default router;
