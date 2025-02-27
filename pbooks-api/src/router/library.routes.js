import { Router } from "express";

import {
  getAll,
  getOne,
  getBySearch,
  getAuthorsBySearch,
  getReviews,
  create,
  update,
  updateStatus,
  removeWork,
  removeVolume,
} from "../controllers/library.controller.js";

const router = Router();

//PUBLIC
router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);
router.get("/volumes/:id/reviews", getReviews);

//USERS
router.post("/create", create);
router.delete("/:id", removeWork);
router.patch("/:id", update);
router.delete("/volumes/:id", removeVolume);

//MODERATOR
router.patch("/volumes/:id/status", updateStatus);

//ADMIN
router.get("/authors/search", getAuthorsBySearch);

export default router;