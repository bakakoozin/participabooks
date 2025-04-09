import verifyToken from "./verifyToken.js";

export default (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) return next();

  return verifyToken(req, res, next);
};
