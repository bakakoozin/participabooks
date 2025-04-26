import verifyToken from "./verifyToken.js";

// Middleware pour vérifier un token JWT sans bloquer l'accès si le token est absent
// Pour reconnaître le compte sans obliger la reconnexion
export default (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return next();

  return verifyToken(req, res, next);
};
