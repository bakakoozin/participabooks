import { hash, genSalt } from "bcrypt";
import User from "../models/users.model.js";
import sendResponse from "../helpers/sendResponse.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  try {
    const [users] = await User.findAll();
    req.json({ datas: users });
  } catch (error) {
    next(error);
  }
};

const getInfos = async (req, res, next) => {
  const { userId } = req.user;
  try {
    const [response] = await User.findOne(userId);
    if (response.length) {
      res.json({ message: "Utilisateur récupéré.", datas: response[0] });
      return;
    }
    res.status(400).json({
      message: "Utilisateur non trouvé.",
    });
  } catch (error) {
    next(error);
  }
};

const getBySearch = async (req, res, next) => {
  const formattedSearch = `%${req.query.q.trim() || ""}%`;
  try {
    const [response] = await User.findBySearch(formattedSearch);

    if (response.length) {
      sendResponse(res, "Utilisateurs récupérés.", 200, response);
    }
    sendResponse(res, "Aucun utilisateur trouvé.", 400);
    return;
  } catch (error) {
    next(error);
  }
};

//============================== PATCH =======================================//

const update = async (req, res, next) => {
  const { email, pseudo, password } = req.body;
  const userId = req.user.id;

  const userInfos = {};
  if (email) userInfos.email = email;
  if (pseudo) userInfos.pseudo = pseudo;
  if (password) {
    const hashedPassword = await hash(password, await genSalt());
    userInfos.password = hashedPassword;
  }

  if (Object.keys(userInfos).length === 0) {
    return res.status(400).json({ message: "Aucune mise à jour à effectuer." });
  }

  const fields = Object.keys(userInfos)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(userInfos);
  values.push(userId);

  const UPDATE_USER = `UPDATE users SET ${fields} WHERE id = ?`;

  try {
    const result = await User.update(UPDATE_USER, values);

    if (result.error) {
      return res.status(500).json(result);
    }

    res.json({ success: "Utilisateur mis à jour." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  console.log("Début de l'upload d'avatar");

  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }

  if (!req.avatarUrl) {
    return res.status(400).json({ message: "Aucune image traitée." });
  }

  try {
    const result = await User.updateAvatar(req.avatarUrl, userId);
    if (!result) {
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'avatar en base." });
    }

    return res.json({
      message: "Avatar mis à jour avec succès !",
      avatarUrl: req.avatarUrl,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const updateByAdmin = async (req, res, next) => {
  const { id, status, role } = req.body;

  const userInfos = {};
  if (status !== undefined) userInfos.status = status;
  if (role !== undefined) userInfos.role = role;

  if (Object.keys(userInfos).length === 0) {
    return res.status(400).json({ message: "Aucune mise à jour à effectuer." });
  }

  const fields = Object.keys(userInfos)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(userInfos);
  values.push(id);

  const UPDATE_BY_ADMIN = `UPDATE users SET ${fields} WHERE id = ?`;

  try {
    const result = await User.update(UPDATE_BY_ADMIN, values);

    if (result.error) {
      return res.status(500).json(result);
    }

    res.status(200).json({ success: "Utilisateur mis à jour par l'admin." });
  } catch (error) {
    next(error);
  }
};

const updateTheme = async (req, res, next) => {
  const { id, theme } = req.body;
  if (!theme) {
    return res.status(400).json({ message: "Thème manquant." });
  }
  try {
    const result = await User.userTheme(theme, id);
    if (result.error) {
      return res.status(500).json(result);
    }
    res.json({ success: "Thème mis à jour.", theme });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du thème:", error);
    next(error);
  }
};

//============================== DELETE =======================================//

const remove = async (req, res, next) => {
  try {
    const [response] = await User.delete(req.user.id);
    if (response.affectedRows) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.json({ message: "Compte supprimé." });
      return;
    }
    res.status(400).json({ message: "Ce compte n'existe pas." });
    return;
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  getInfos,
  getBySearch,
  update,
  updateByAdmin,
  uploadAvatar,
  updateTheme,
  remove,
};
