import { Router } from "express";

import { getAll } from "../controllers/library.controller.js"

const router = Router();

router.get("/", getAll);

export default router;