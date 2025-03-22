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
router.post("/volumes/create", verifyToken, createVolume);
router.patch("/uploads", verifyToken, uploadMedia);
router.delete("/:id", removeWork);
// router.patch("/:id", verifyToken, updateWork);
router.get("/volumes/:id", verifyToken, getVolumeDetails);
router.patch("/volumes/:id", verifyToken, updateVolume);
router.delete("/volumes/:id", removeVolume);

//MODERATOR
router.patch("/volumes/:id/status", updateStatus);

//ADMIN
router.get("/authors/search", getAuthorsBySearch);

export default router;
