import { hash, genSalt, compare } from "bcrypt";

import createToken from "../utils/token.js";
import Auth from "../models/auth.model.js";

const register = async (req, res, next) => {
  const { email, pseudo, password } = req.body;

  try {
    const hashedPassword = await hash(password, await genSalt());
    const response = await Auth.createUser({
      email,
      pseudo,
      password: hashedPassword,
    });
    res.status(201).json({
      msg: "Utilisateur créé.",
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [[user]] = await Auth.findUserForAuth(email);

    if (user && (await compare(password, user.password))) {
      const token = createToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 86400000,
      });

      res.json({
        msg: "Utilisateur connecté",
        user: {
          id: user.id,
          email: user.email,
          pseudo: user.pseudo,
          role: user.role,
          avatar: user.avatar,
          theme: user.theme,
          status: user.status,
        },
      });
      return;
    }
    return res.status(400).json({
      msg: "Identifiants invalides.",
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    next(error);
  }
};

const logout = (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ msg: "Utilisateur bien déconnecté." });
};

const getSession = async (req, res, next) => {
  res.json({ user: req.user });
};

export { register, login, logout, getSession };
