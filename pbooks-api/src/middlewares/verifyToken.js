import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET_TOKEN;

export default (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Accès refusé: token manquant.",
      });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Token expiré."
            : "Token invalide.";
        return res.status(403).json({
          success: false,
          error: message,
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la vérification du token.",
    });
  }
};
