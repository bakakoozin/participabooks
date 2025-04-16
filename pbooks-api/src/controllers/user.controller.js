import { hash, genSalt } from "bcrypt";
import path from "path";
import fs from "fs";

import User from "../models/users.model.js";
import handleUpload from "../config/formidable.js";
import { getPage } from "../utils/getPage.js";

//============================== GET =======================================//

const getAll = async (req, res, next) => {
  const page = getPage(req);
  const search = req.query.q?.trim() || "";
  const limit = 25;

  try {
    const { datas, count } = await User.findAll(search, page, limit);
    const totalPages = Math.ceil(count / limit);
    res.json({ datas, totalPages });
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

const getBySearch = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res
      .status(400)
      .json({ message: "Paramètre de recherche manquant." });
  }

  try {
    const formatted = `%${q}%`;
    const [datas] = await User.findBySearch(formatted);

    return res.status(200).json({ datas });
  } catch (err) {
    console.error("Erreur dans getBySearch :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la recherche." });
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
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }

  const formOptions = {
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/temp"),
    maxFileSize: 5 * 1024 * 1024,
  };

  handleUpload(
    req,
    res,
    async () => {
      if (!req.files || !req.files.avatar) {
        return res.status(400).json({ message: "Fichier avatar manquant." });
      }

      const avatarFile = req.files.avatar[0];
      const fileExt = path
        .extname(avatarFile.originalFilename || "")
        .toLowerCase();
      const validExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      if (!validExtensions.includes(fileExt)) {
        fs.unlink(avatarFile.path, () => {});
        return res
          .status(400)
          .json({ message: "Format de fichier non autorisé." });
      }

      const newFilename = `avatar_${Date.now()}${fileExt}`;
      const outputFilePath = path.join(
        process.cwd(),
        "public/uploads/avatars",
        newFilename
      );

      try {
        fs.renameSync(avatarFile.filepath, outputFilePath);

        const [user] = await User.findOne(userId);
        const oldAvatar = user[0]?.avatar;
        if (oldAvatar && oldAvatar !== "default-avatar.png") {
          fs.unlink(
            path.join(process.cwd(), "public/uploads/avatars", oldAvatar),
            () => {}
          );
        }

        await User.updateAvatar(newFilename, userId);
        return res.send(newFilename);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Erreur lors du traitement de l'image.",
          error: error.message,
        });
      }
    },
    formOptions
  );
};

const updateByAdmin = async (req, res, next) => {
  const { id, status, role } = req.body;

  const userInfos = {};
  if (status) userInfos.status = status;
  if (role) userInfos.role = role;

  if (!id || Object.keys(userInfos).length === 0) {
    return res.status(400).json({ message: "ID ou données manquantes" });
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

    res.json({ success: "Utilisateur mis à jour par l'admin." });
  } catch (error) {
    next(error);
  }
};

const updateTheme = async (req, res, next) => {
  const { theme } = req.body;
  const id = req.user.id;
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
  const id = req.body.id || req.user.id;

  if (!id) {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }

  if (req.user.role === "admin" && id === req.user.id) {
    return res.status(400).json({
      message: "Un administrateur ne peut pas supprimer son propre compte.",
    });
  }

  try {
    const [response] = await User.delete(id);

    if (response.affectedRows) {
      if (id === req.user.id) {
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
      }
      return res.json({ message: "Compte supprimé." });
    }
    return res.status(400).json({ message: "Ce compte n'existe pas." });
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
