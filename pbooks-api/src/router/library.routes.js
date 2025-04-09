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
router.get("/volumes/:id/reviews", getReviews);

//USERS
router.patch("/:id", verifyToken, updateWork);
router.post("/create", verifyToken, createWork);
router.patch("/uploads/:id", verifyToken, uploadMedia);
router.delete("/work/:id", verifyToken, removeWork);
router.get("/volumes/:id", verifyToken, getVolumeDetails);
router.patch("/volumes/:id", verifyToken, updateVolume);
router.delete("/volume/:id", verifyToken, removeVolume);
router.post("/volumes/create", verifyToken, createVolume);

//MODERATOR
router.patch("/volumes/:id/status", verifyToken, updateStatus);

//ADMIN
// router.get("/authors/search", verifyToken, isAdmin, getAuthorsBySearch);

export default router;
