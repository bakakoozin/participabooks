import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({ id }) => {
  const payload = {
    id,
  };
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, SECRET, options);
};
