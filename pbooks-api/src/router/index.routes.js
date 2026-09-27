import { Router } from "express";

import libraryRoutes from "./library.routes.js";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";

import verifyZitadelToken from "../middlewares/verifyZitadelToken.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", verifyZitadelToken(), userRoutes);
router.use("/works", libraryRoutes);
router.use("/admin", verifyZitadelToken(), isAdmin, adminRoutes);

export default router;
