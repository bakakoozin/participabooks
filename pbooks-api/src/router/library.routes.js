import { Router } from "express";

import verifyZitadelToken from "../middlewares/verifyZitadelToken.js";
import hasProjectRole from "../middlewares/hasProjectRole.js";

import {
  getAll,
  getOne,
  getVolumeDetails,
  createWork,
  createVolume,
  updateWork,
  updateVolume,
  updateStatus,
  removeWork,
  removeVolume,
  uploadMedia,
} from "../controllers/library.controller.js";

const router = Router();

//PUBLIC
router.get("/", verifyZitadelToken(false), getAll);
router.get("/:id", getOne);

//USERS
router.patch("/:id", verifyZitadelToken(), updateWork);
router.post("/create", verifyZitadelToken(), createWork);
router.patch("/uploads/:id", verifyZitadelToken(), uploadMedia);
router.delete("/work/:id", verifyZitadelToken(), removeWork);
router.get("/volumes/:id", verifyZitadelToken(), getVolumeDetails);
router.patch("/volumes/:id", verifyZitadelToken(), updateVolume);
router.delete("/volume/:id", verifyZitadelToken(), removeVolume);
router.post("/volumes/create", verifyZitadelToken(), createVolume);

//MODERATOR ADMIN
router.patch(
  "/volumes/:id/status",
  verifyZitadelToken(),
  hasProjectRole("moderator", "admin"),
  updateStatus
);

export default router;
