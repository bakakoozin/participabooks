import { Router } from "express";

import { register, login, logout, getSession } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validators/validate.js";
import { registerSchema, loginSchema } from "../middlewares/validators/auth.schema.js";
import verifyTokenNoBlock from "../middlewares/verifyTokenNoBlock.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/session", verifyTokenNoBlock, getSession);

export default router;