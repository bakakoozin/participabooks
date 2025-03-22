import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyTokenNoBlock from "../middlewares/verifyTokenNoBlock.js";

import {
  getAll,
  getOne,
  getVolumeDetails,
  getAuthorsBySearch,
  getReviews,
  createWork,
  createVolume,
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
router.get("/volumes/:id/reviews", getReviews);

//USERS
router.post("/create", verifyToken, createWork);
router.delete("/work/:id", verifyToken, removeWork);
router.get("/volumes/:id", verifyToken, getVolumeDetails);
router.post("/volumes/create", verifyToken, createVolume);
router.patch("/volumes/:id", verifyToken, updateVolume);
router.delete("/volume/:id", verifyToken, removeVolume);
router.patch("/uploads", verifyToken, uploadMedia);

//MODERATOR
router.patch("/volumes/:id/status", updateStatus);

//ADMIN
router.get("/authors/search", getAuthorsBySearch);

export default router;
