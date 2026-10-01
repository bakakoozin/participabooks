export default (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      message: "Accès refusé : rôle Zitadel insuffisant.",
    });
  }

  return next();
};
