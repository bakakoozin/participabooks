import jwt from "jsonwebtoken";

const createToken = (user) => {
  const payload = {
    userId: user.id,
    pseudo: user.pseudo,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    theme: user.theme,
    status: user.status,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export default createToken;
