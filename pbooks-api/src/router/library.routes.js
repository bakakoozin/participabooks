import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";

import {
  getAll,
  getOne,
  getAuthorsBySearch,
  getReviews,
  create,
  update,
  updateStatus,
  removeWork,
  removeVolume,
  uploadMedia,
} from "../controllers/library.controller.js";

const router = Router();

//PUBLIC
router.get("/", getAll);
router.get("/:id", getOne);
router.get("/volumes/:id/reviews", getReviews);

//USERS
router.post("/create", verifyToken, create);
router.post("/uploads/medias", verifyToken, uploadMedia);
router.delete("/:id", removeWork);
router.patch("/:id", update);
router.delete("/volumes/:id", removeVolume);

//MODERATOR
router.patch("/volumes/:id/status", updateStatus);

//ADMIN
router.get("/authors/search", getAuthorsBySearch);

export default router;