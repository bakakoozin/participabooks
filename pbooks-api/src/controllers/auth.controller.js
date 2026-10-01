import { createChallenge, verifySolution } from "../services/altcha.service.js";
import { assertSignupRateLimit } from "../services/signup-rate-limit.service.js";
import {
  assignProjectRole,
  createHumanUser,
  sendEmailVerification,
} from "../services/zitadel.service.js";

// Enregistrer un nouvel utilisateur
const register = async (req, res, next) => {
  const { email, pseudo, password, altcha } = req.body;

  try {
    await assertSignupRateLimit(req.ip);
    if (!verifySolution({ payload: altcha, secret: process.env.ALTCHA_HMAC_KEY })) {
      return res.status(400).json({ msg: "Validation anti-robot invalide." });
    }
    const user = await createHumanUser({ email: email.toLowerCase(), pseudo, password });
    await assignProjectRole(user.userId, "user");
    await sendEmailVerification(user.userId);
    return res.status(202).json({
      msg: "Si l'adresse peut être enregistrée, un e-mail de vérification vous sera envoyé.",
    });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ msg: error.message });
    if (error.status === 409) {
      return res.status(202).json({
        msg: "Si l'adresse peut être enregistrée, un e-mail de vérification vous sera envoyé.",
      });
    }
    next(error);
  }
};

const registrationChallenge = (_req, res, next) => {
  try {
    return res.json(createChallenge({ secret: process.env.ALTCHA_HMAC_KEY }));
  } catch (error) {
    return next(error);
  }
};

const getSession = async (req, res, next) => {
  try {
    return res.json({ user: req.user });
  } catch (error) {
    return next(error);
  }
};

export { register, registrationChallenge, getSession };
