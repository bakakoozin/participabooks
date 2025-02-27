import { Router } from "express";

import { register, login, logout, session } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validators/validate.js";
import { registerSchema, loginSchema } from "../middlewares/validators/auth.schema.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/session", verifyToken, session);

export default router;