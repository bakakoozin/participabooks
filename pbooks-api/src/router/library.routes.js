import { Router } from "express";

import verifyTokenNoBlock from "../middlewares/verifyTokenNoBlock.js";
import { validate } from "../middlewares/validators/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
import {isbnSchema} from "../middlewares/validators/auth.schema.js";

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
router.get("/", verifyTokenNoBlock, getAll);
router.get("/:id", getOne);

//USERS
router.patch("/:id", verifyToken, updateWork);
router.post("/create", verifyToken, createWork);
router.patch("/uploads/:id", verifyToken, uploadMedia);
router.delete("/work/:id", verifyToken, removeWork);
router.get("/volumes/:id", verifyToken, getVolumeDetails);
router.patch("/volumes/:id", verifyToken, updateVolume);
router.delete("/volume/:id", verifyToken, removeVolume);
router.post("/volumes/create", verifyToken, validate(isbnSchema), createVolume);

//MODERATOR ADMIN
router.patch("/volumes/:id/status", verifyToken, updateStatus);

export default router;
