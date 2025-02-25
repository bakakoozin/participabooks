import { Router } from "express";

import { getAll, getOne, getBySearch, getAuthorsBySearch, create, update, updateStatus, removeWork, removeVolume } from "../controllers/library.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/search", getBySearch);
router.get("/:id", getOne);

router.post("/create", create);
router.delete("/:id", removeWork);
router.patch("/:id", update);

router.patch("/volumes/:id/status", updateStatus);
router.delete("/volumes/:id", removeVolume);

router.get("/authors/search", getAuthorsBySearch);

export default router;