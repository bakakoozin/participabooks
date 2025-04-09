import jwt from "jsonwebtoken";

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
    jwt.verify(token, SECRET, (err, decoded) => {
      const message =
        err.name === "TokenExpiredError" ? "Token expiré." : "Token invalide.";
        
      if (err) throw new Error({ message, status: 403 });

      req.user = decoded;
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
