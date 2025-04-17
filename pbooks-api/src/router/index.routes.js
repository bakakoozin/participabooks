import { Router } from "express";

import libraryRoutes from "./library.routes.js";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";

import verifyToken from "../middlewares/verifyToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", verifyToken, userRoutes);
router.use("/works", libraryRoutes);
router.use("/admin", verifyToken, isAdmin, adminRoutes);

export default router;
