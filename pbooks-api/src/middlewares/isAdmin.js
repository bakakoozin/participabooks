export default (req, res, next) => {
    if (req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Accès refusé: rôle insuffisant !" });
    }
}