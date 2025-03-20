import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next();
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
    return next();
  }
};