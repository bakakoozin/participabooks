import { Router } from "express";

import libraryRoutes from "./library.routes.js"

import verifyToken from "./middlewares/verifyToken.js"

const router = Router();

router.get("/", libraryRoutes);


export default router;