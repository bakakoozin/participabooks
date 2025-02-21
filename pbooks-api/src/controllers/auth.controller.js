// import { hash, genSalt, compare } from "bcrypt";

import Auth from "../models/auth.model";

const register = async (req, res, next) => {
  const { email, pseudo, password } = req.body;

  try {
    const response = await Auth.createUser({
      email,
      pseudo,
      password,
    });
    res.status(201).json({
      success: "Utilisateur créé.",
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
      res.json({
        success: "Utilisateur connecté.",
        user: {
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
    res.status(400).json({
      msg: "Identifiants invalides.",
    });
    return;
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.json({ success: "Utilisateur déconnecté." });
  } catch (error) {
    next(error);
  }
};

const refreshLogin = async (req, res, next) => {
  res.json({
    success: "Autorrisé à se reconnecter.",
    user: {
      email: req.user.email,
      pseudo: req.user.pseudo,
      role: req.user.role,
      avatar: req.user.avatar,
      theme: req.user.theme,
      status: req.user.status,
    },
  });
};

export { register, login, logout, refreshLogin };
