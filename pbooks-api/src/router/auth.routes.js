import { Router } from "express";

import verifyZitadelToken from "../middlewares/verifyZitadelToken.js";
import { validate } from "../middlewares/validators/validate.js";
import {
  register,
  getSession,
  registrationChallenge,
} from "../controllers/auth.controller.js";
import {
  registerSchema,
} from "../middlewares/validators/auth.schema.js";

const router = Router();

router.get("/registration-challenge", registrationChallenge);
router.post("/register", validate(registerSchema), register);
router.get("/session", verifyZitadelToken(), getSession);

export default router;
