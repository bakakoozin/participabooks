import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const SECRET = process.env.JWT_SECRET;

export default (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Accès refusé: token manquant.",
    });
  }
  try {
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Token expiré."
            : "Token invalide.";
        throw new Error({ message, status: 403 });
      }
      const [response] = await User.findOne(decoded.id);
      req.user = response[0];
      if (!req.user)
        throw new Error({ message: "Utilisateur non trouvé.", status: 404 });
      if (req.user.status !== "actif")
        throw new Error({
          message: "Utilisateur bloqué.",
          status: 403,
        });
      next();
    });
  } catch (error) {
    const statusCode = error.status || 500;
    const message =
      error.message || "Erreur serveur lors de la vérification du token.";

    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
};
