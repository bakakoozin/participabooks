export default (req, res, next) => {
    if (req.users.role === "moderator" || req.users.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé: rôle insuffisant !" });
    }
}