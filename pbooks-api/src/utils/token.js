import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export default ({ id, pseudo, email, role, avatar, theme, status }) => {
  const payload = {
    id,
    pseudo,
    email,
    role,
    avatar,
    theme,
    status,
  };
  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, SECRET, options);
};
