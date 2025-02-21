import { Router } from "express";

import { getAll, getOne, getBySearch, getAuthorsBySearch, create, update, updateStatus, removeWork, removeVolume } from "../controllers/library.controller.js";

const router = Router();

router.get("/works", getAll);
router.get("/works/search", getBySearch);
router.get("/works/:id", getOne);

router.post("/works/create", create);
router.delete("/works/:id", removeWork);
router.patch("/works/:id", update);

router.patch("/volumes/:id/status", updateStatus);
router.delete("/volumes/:id", removeVolume);

router.get("/authors/search", getAuthorsBySearch)

export default router;