import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import libraryRoutes from "./library.routes.js";
import adminRoutes from "./admin.routes.js";

import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", verifyToken, userRoutes);
router.use("/works", libraryRoutes);
router.use("/admin", adminRoutes);

export default router;