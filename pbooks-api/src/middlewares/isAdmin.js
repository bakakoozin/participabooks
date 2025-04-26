// Middleware pour vérifier si l'utilisateur est un administrateur
export default (req, res, next) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ message: "Accès refusé: vous devez être administrateur !" });

  next();
};
